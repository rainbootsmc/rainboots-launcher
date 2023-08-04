import { ZodMclcUser } from '../../api/util/auth.ts';

export const strictUser = (user: ZodMclcUser): ZodMclcUser => {
  const meta: ZodMclcUser['meta'] | null = user.meta
    ? {
      refresh: user.meta.refresh,
      exp: user.meta.exp,
      type: user.meta.type,
      xuid: user.meta.xuid,
      demo: user.meta.demo,
    }
    : null;
  return {
    access_token: user.access_token,
    client_token: user.client_token,
    name: user.name,
    uuid: user.uuid,
    user_properties: user.user_properties,
    meta,
  };
};
