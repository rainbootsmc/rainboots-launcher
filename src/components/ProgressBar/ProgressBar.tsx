import { FC, useMemo } from 'react';
import * as styles from './ProgressBar.css.ts';

type Props = {
  value: number
}

const ProgressBar: FC<Props> = ({ value }) => {
  const clamped = useMemo(() => {
    if (value < 0) {
      return 0;
    } else if (value > 1) {
      return 1;
    } else {
      return value;
    }
  }, [value]);
  return <div className={styles.progressBar}>
    <div className={styles.colorBar} style={{ width: `calc(100% * ${clamped})` }}/>
  </div>;
};

export default ProgressBar;
