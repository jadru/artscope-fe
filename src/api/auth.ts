import { SignupInputs } from '@/pages/user/signup';
import jxios from '@/utils/jxios';

const refreshToken = async (refreshToken: string) =>
  jxios.post('/api/refresh', refreshToken, {
    data: refreshToken,
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

const checkUsername = (username: string) =>
  jxios.get('/api/members/username/' + username);

const checkEmail = (email: string) => jxios.get('/api/members/email/' + email);

const changeNewUsername = (
  currentUsername: string | undefined,
  newUsername: string
) =>
  jxios.put('/api/members/' + currentUsername + '/username', null, {
    params: { newUsername },
  });

const signup = (data: SignupInputs) => jxios.post('/api/members', data);

const emailCheck = (email: string) =>
  jxios.post('/api/mail/authenticate', null, {
    params: { email },
  });

export const auth = {
  refresh: refreshToken,
  login: loginWithIDPW,
  email: validateEmail,
  username: checkUsername,
  changeusername: changeNewUsername,
  signup,
  emailcheck: emailCheck,
  checkemail: checkEmail,
};
