import { FC, useCallback, useLayoutEffect, useState } from 'react';
import { trpc } from '~/trpc.ts';
import { MinecraftUserData } from '../../../api/auth.ts';
import { useAuthListener } from '~/hook/useAuthListener.ts';
import * as styles from './UserIcon.css.ts';
import { RiLogoutBoxRLine } from 'react-icons/ri';

const UserIcon: FC = () => {
  const { data: cachedData, isFetched } = trpc.getCachedUser.useQuery();
  const { mutate: logoutMutation } = trpc.logout.useMutation();
  const [data, setData] = useState<MinecraftUserData | undefined>();
  useAuthListener(setData);
  useLayoutEffect(() => {
    if (isFetched && cachedData) {
      setData(cachedData);
    }
  }, [cachedData, isFetched]);
  const logout = useCallback(() => {
    logoutMutation();
    setData(undefined);
  }, [logoutMutation]);

  if (!data) {
    return null;
  }

  return <button type={'button'} className={styles.wrapper} onClick={() => logout()}>
    <div className={styles.logoutOverlay}>
      <RiLogoutBoxRLine className={styles.logoutIcon}/>
      <span>LOGOUT</span>
    </div>
    <div className={styles.icon}>
      <img className={styles.avatar} src={`https://minotar.net/helm/${data.uuid}/24.png`} alt="" draggable={false}/>
    </div>
    <span className={styles.name}>{data.username}</span>
  </button>;
};

export default UserIcon;
