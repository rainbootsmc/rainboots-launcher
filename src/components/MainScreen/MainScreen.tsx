import { FC } from 'react';
import Contents from '~/components/Contents/Contents.tsx';
import AppBottom from '~/components/AppBottom/AppBottom.tsx';
import UserIcon from '~/components/UserIcon/UserIcon.tsx';
import * as styles from './MainScreen.css.ts';

const MainScreen: FC = () => {
  return <>
    <Contents>
      <div className={styles.userIcon}>
        <UserIcon/>
      </div>
    </Contents>
    <AppBottom/>
  </>;
};

export default MainScreen;
