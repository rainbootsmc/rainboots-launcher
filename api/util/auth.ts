import { z } from 'zod';

export const ZodMclcUser = z.object({
  access_token: z.string(),
  client_token: z.ostring(),
  uuid: z.string(),
  name: z.ostring(),
  user_properties: z.any(),
  meta: z.object({
    refresh: z.ostring(),
    exp: z.onumber(),
    type: z.union([
      z.literal('mojang'),
      z.literal('msa'),
      z.literal('legacy'),
    ]),
    xuid: z.string(),
    demo: z.oboolean(),
  }).nullable(),
});

export type ZodMclcUser = z.infer<typeof ZodMclcUser>

export const ZodMSAuthToken = z.object({
  token_type: z.string(),
  expires_in: z.number(),
  scope: z.string(),
  access_token: z.string(),
  refresh_token: z.string(),
  user_id: z.string(),
  foci: z.string(),
});

export type ZodMSAuthToken = z.infer<typeof ZodMSAuthToken>
