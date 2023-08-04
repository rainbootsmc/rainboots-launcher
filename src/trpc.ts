import { createTRPCReact } from '@trpc/react-query';
import { AppRouter } from '../api/trpc.ts';

export const trpc = createTRPCReact<AppRouter>();
