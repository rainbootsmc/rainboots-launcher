import { FC, useMemo } from 'react';
import * as styles from './TitleBar.css.ts';
import { trpc } from '~/trpc.ts';
import { RiCloseFill, RiFolder3Line, RiSettingsLine, RiSubtractFill } from 'react-icons/ri';

const TitleBar: FC = () => {
  const { mutate: closeWindow } = trpc.closeWindow.useMutation();
  const { mutate: minimizeWindow } = trpc.minimizeWindow.useMutation();
  const { mutate: openSettingsFile } = trpc.openSettingsFile.useMutation();
  const { mutate: openInstanceDir } = trpc.openInstanceDir.useMutation();
  const { data } = trpc.getVersion.useQuery();
  const versionText = useMemo(() => data && <span className={styles.appVersion}>v{data}</span>, [data]);
  return <>
    <div className={styles.titleBarWrapper}>
      <div className={styles.titleBar}>
        <span className={styles.appName}>Rainboots Launcher</span>
        {versionText}
      </div>
      <div className={styles.buttons}>
        <button type={'button'} className={styles.button} tabIndex={-1} onClick={() => openInstanceDir()}>
          <RiFolder3Line className={styles.buttonIcon}/>
        </button>
        <button type={'button'} className={styles.button} tabIndex={-1} onClick={() => openSettingsFile()}>
          <RiSettingsLine className={styles.buttonIcon}/>
        </button>
        <div className={styles.divider}/>
        <button type={'button'} className={styles.button} tabIndex={-1} onClick={() => minimizeWindow()}>
          <RiSubtractFill className={styles.buttonIcon}/>
        </button>
        <button type={'button'} className={styles.button} tabIndex={-1} onClick={() => closeWindow()}>
          <RiCloseFill className={styles.buttonIcon}/>
        </button>
      </div>
    </div>
  </>;
};

export default TitleBar;
