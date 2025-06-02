import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const onSuccess = (roleStatus: string, router: AppRouterInstance) => {
  router.refresh();
};
