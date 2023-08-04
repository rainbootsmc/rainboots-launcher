import { FC, ReactNode } from 'react';
import * as styles from './Contents.css.ts';

type Props = {
  children: ReactNode
}

const Contents: FC<Props> = ({ children }) => {
  return <div className={styles.contents}>
    {children}
  </div>;
};

export default Contents;
