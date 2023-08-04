import { FC } from 'react';
import * as styles from './AppBottom.css.ts';
import PlayButton from '~/components/PlayButton/PlayButton.tsx';

const AppBottom: FC = () => {
  return <div className={styles.appBottom}>
    <div className={styles.playButtonWrapper}>
      <PlayButton />
    </div>
  </div>;
};

export default AppBottom;
