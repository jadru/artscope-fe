import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const onSuccess = (
  roleStatus: string,
  router: AppRouterInstance,
  redirect: string
) => {
  redirect && redirect !== ''
    ? router.push(
        redirect.replace(
          new RegExp(`^${process.env.NEXT_PUBLIC_ROOT_URL}`),
          ''
        ) || '/'
      )
    : router.push('/');
};
