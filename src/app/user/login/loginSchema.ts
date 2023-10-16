import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  username: yup.string().required('아이디를 입력하세요.'),
  password: yup.string().required('비밀번호를 입력하세요'),
});
export interface loginInputs {
  username: string;
  password: string;
}
