import { FC, useMemo } from 'react';
import { useUpdateInfo } from '~/hook/useUpdateInfo.ts';

export const UpdateText: FC = () => {
  const { updateAvailable, completed, progressPercent } = useUpdateInfo();
  return useMemo(() => {
    if (completed) {
      return <>再起動後に更新されます</>;
    }
    if (updateAvailable) {
      let text = 'ランチャーを更新中';
      if (progressPercent > 0) {
        text += ` ${Math.floor(progressPercent)}%`;
      }
      return <>{text}</>;
    }
    return <></>;
  }, [completed, progressPercent, updateAvailable]);
};
