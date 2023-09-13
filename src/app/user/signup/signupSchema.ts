import * as yup from 'yup';

const signupSchema = yup.object().shape({
  username: yup.string().required('아이디를 입력하세요.'),
  password: yup
    .string()
    .min(8, '비밀번호는 8자 이상입니다.')
    .required('비밀번호를 입력하세요'),
  email: yup
    .string()
    .email('이메일 형식이 아닙니다.')
    .required('이메일을 입력하세요.'),
  name: yup.string().required('작가명을 입력하세요.'),
  passwordCheck: yup
    .string()
    .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다.')
    .required('비밀번호를 한번 더 입력해주세요.'),
  agree: yup
    .boolean()
    .oneOf([true], '약관에 동의해주세요.')
    .required('약관에 동의해주세요.'),
});

export interface SignupInputs {
  username: string;
  password: string;
  email: string;
  passwordCheck?: string;
  name: string;
  agree?: boolean;
}

export default signupSchema;
