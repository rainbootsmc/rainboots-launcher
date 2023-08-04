import { useCallback, useMemo, useState } from 'react';
import { trpc } from '~/trpc.ts';
import { LauncherListener } from '../../api/launcherListener.ts';
import { useLauncherLog } from '~/hook/useLauncherLog.ts';
import { strictUser } from '~/util/user.ts';
import { InitEnvResult } from '../../api/initEnv.ts';
import { ZodMclcUser } from '../../api/util/auth.ts';

type LaunchStatus = {
  isLoading: boolean
  isPlaying: boolean
  message: string | undefined
  stage: string | undefined
  progress: number
}

export const useLaunch = (): [() => void, LaunchStatus] => {
  const { mutateAsync: initEnv } = trpc.initEnv.useMutation();
  const { mutateAsync: installJava } = trpc.installJava.useMutation();
  const { mutateAsync: startAuth } = trpc.startAuth.useMutation();
  const { mutateAsync: launchGame } = trpc.launchGame.useMutation({
    onSuccess: () => {
      setPlaying(true);
      onFinally();
    },
    onError: (e) => {
      setMessage('ERROR');
      console.error('エラーが発生しました', e);
      onFinally();
    },
  });
  const [isLoading, setLoading] = useState(false);
  const [isPlaying, setPlaying] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [stage, setStage] = useState<string | undefined>(undefined);
  const [progress, setProgress] = useState<number>(0);
  const onFinally = useCallback(() => {
    setLoading(false);
    setMessage(undefined);
    setStage(undefined);
    setProgress(0);
  }, []);
  const onDataLog = useCallback((message: string) => {
    console.log(message);
  }, []);
  const onDebugLog = useCallback((message: string) => {
    console.log('[DEBUG]', message);
  }, []);
  const onClose = useCallback(() => {
    setPlaying(false);
  }, []);
  const onProgress = useCallback(({ task, total }: { type: string, task: number, total: number }) => {
    if (task > 0) {
      setProgress(task / total);
      setStage(`Minecraftをロード中 (${task}/${total})`);
    }
  }, []);
  const listener: LauncherListener = useMemo(() => ({
    onDataLog,
    onDebugLog,
    onClose,
    onProgress,
  }), [onClose, onDataLog, onDebugLog, onProgress]);
  useLauncherLog(listener);
  const launch = useCallback(async () => {
    setLoading(true);
    setMessage('LOADING');

    const promises: Promise<unknown>[] = [];

    let initResult: InitEnvResult | undefined;
    let user: ZodMclcUser | undefined;
    setStage('初期化中');
    promises.push(initEnv().then(result => initResult = result));
    promises.push(startAuth().then(result => user = result));

    await Promise.all(promises);

    if (initResult && !initResult.java.isCustom && !initResult.java.isInstalled) {
      setStage('Javaをインストール中');
      await installJava();
    }

    try {
      if (user == undefined) {
        return Promise.reject();
      }
      setStage('Minecraftをロード中');
      await launchGame(strictUser(user));
    } catch (e) {
      const message = (e as Record<string, unknown>)['message'];
      if (message === 'error.gui.closed') {
        setMessage(undefined);
        setStage(undefined);
        setLoading(false);
        return;
      }
      console.error(e);
    }
  }, [initEnv, installJava, launchGame, startAuth]);
  const status: LaunchStatus = useMemo(() => ({
    isLoading,
    isPlaying,
    message,
    stage,
    progress,
  }), [isLoading, isPlaying, message, progress, stage]);
  return [launch, status];
};
