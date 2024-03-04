import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const onSuccess = (
  roleStatus: string,
  router: AppRouterInstance,
  redirect?: string | null
) => {
  if (redirect) router.push(redirect);
};
