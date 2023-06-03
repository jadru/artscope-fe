import { Cookies } from 'react-cookie';

import jxios from '@/utils/jxios';

const refreshToken = async (cookies: Cookies) =>
  jxios.post('/api/refresh', cookies.get('refreshToken'), {
    data: cookies.get('refreshToken'),
    headers: {
      'Content-Type': 'text/plain',
    },
  });

const loginWithIDPW = async (data: { username: string; password: string }) =>
  jxios.post('/api/login', data);

const validateEmail = async (code: string) =>
  jxios.get('/api/mail/authenticate', {
    params: { code },
  });

export const auth = {
  refresh: refreshToken,
  login: loginWithIDPW,
  email: validateEmail,
};
