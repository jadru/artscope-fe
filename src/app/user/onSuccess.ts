import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { toast } from 'react-toastify';

export const onSuccess = (artistStatus: string, router: AppRouterInstance) => {
  if (artistStatus === 'NONE') {
    toast('정보를 입력해주세요.');
    router.push('/user/apply');
  } else {
    router.refresh();
  }
};
