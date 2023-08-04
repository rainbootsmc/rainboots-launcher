import { FC, useCallback, useMemo } from 'react';
import * as styles from './PlayButton.css.ts';
import { useLaunch } from '~/hook/useLaunch.ts';
import ProgressBar from '~/components/ProgressBar/ProgressBar.tsx';

const PlayButton: FC = () => {
  const [launch, status] = useLaunch();
  const onClick = useCallback(async () => {
    if (status.isLoading || status.isPlaying) {
      return;
    }
    launch();
  }, [launch, status.isLoading, status.isPlaying]);
  const buttonMessage = useMemo(() => {
    if (status.isPlaying) {
      return 'PLAYING';
    } else if (status.message) {
      return status.message;
    } else {
      return 'PLAY';
    }
  }, [status.isPlaying, status.message]);
  const progressBar = useMemo(() => <ProgressBar value={status.progress}/>, [status.progress]);
  return <>
    <button className={styles.playButton} onClick={onClick} data-loading={status.isLoading || status.isPlaying}
      draggable={false}>
      <span className={styles.statusMessage} data-small={status.message != undefined}>{buttonMessage}</span>
      {status.stage && <span className={styles.stageMessage}>{status.stage}</span>}
    </button>
    {progressBar}
  </>;
};

export default PlayButton;
