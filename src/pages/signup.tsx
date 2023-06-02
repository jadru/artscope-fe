import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import ErrorMessageInput from '@/components/ErrorMessageInput';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';
import Title from '@/components/Title';

import jxios from '@/utils/jxios';

const loginSchema = yup.object().shape({
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

interface loginInputs {
  username: string;
  password: string;
  email: string;
  passwordCheck?: string;
  name: string;
  agree?: boolean;
}
const Signup = () => {
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<loginInputs>({
    resolver: yupResolver(loginSchema),
  });
  const { push } = useRouter();
  const [emailCheck, setEmailCheck] = React.useState<boolean>(false);
  const [usernameCheck, setUsernameCheck] = React.useState<boolean>(false);

  const onSubmit: SubmitHandler<loginInputs> = (data) =>
    !isSubmitting &&
    emailCheck &&
    usernameCheck &&
    delete data.passwordCheck &&
    delete data.agree &&
    jxios.post('/api/members', data, {}).then(() => {
      push('/login').then(() => {
        toast.success('회원가입이 완료되었습니다.');
      });
    });

  const checkEmailDuplication = () => {
    const regex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
    if (regex.test(getValues('email'))) {
      jxios
        .get(`/api/members/email/${getValues('email')}`)
        .then((response) => {
          if (response.status === 200) {
            setEmailCheck(true);
            toast.success('사용 가능한 이메일입니다.');
            clearErrors('email');
          } else {
            toast.warn('이미 사용중인 이메일입니다.');
            setEmailCheck(false);
          }
        })
        .catch(() => {
          setEmailCheck(false);
        });
    } else {
      setError('email', {
        type: 'manual',
        message: '이메일 형식이 아닙니다.',
      });
    }
  };

  const checkUsernameDuplication = () => {
    const regex = new RegExp('^[a-zA-Z0-9]{4,12}$');
    if (regex.test(getValues('username'))) {
      jxios
        .get(`/api/members/username/${getValues('username')}`)
        .then((response) => {
          if (response.status === 200) {
            setUsernameCheck(true);
            toast.success('사용 가능한 아이디입니다.');
            clearErrors('username');
          } else {
            toast.warn('이미 사용중인 아이디입니다.');
            setUsernameCheck(false);
          }
        })
        .catch(() => {
          setUsernameCheck(false);
        });
    } else {
      toast.warn('아이디는 영문, 숫자 4~12자리로 입력해주세요.');
    }
  };

  return (
    <>
      <Seo templateTitle='Signup' />
      <NavBar title='ArtPlatform' />
      <TabLayout>
        <Title>회원가입</Title>
        <form
          className='flex h-full w-full flex-col items-center justify-center space-y-5'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='form-control w-full max-w-md'>
            <label className='label'>
              <span className='label-text'>이메일 입력</span>
            </label>
            <input
              type='email'
              placeholder='이메일을 입력해주세요'
              readOnly={emailCheck}
              className={`input-bordered input-primary input w-full ${
                emailCheck && `bg-gray-200`
              }`}
              {...register('email')}
            />
            {!emailCheck && (
              <button
                type='button'
                className='btn mt-1'
                onClick={checkEmailDuplication}
              >
                이메일 체크
              </button>
            )}
            <ErrorMessageInput>
              {errors.email ? errors.email.message : ''}
            </ErrorMessageInput>
          </div>
          <div className='form-control w-full max-w-md'>
            <label className='label'>
              <span className='label-text'>작가명 입력</span>
            </label>
            <input
              type='text'
              placeholder='작가명을 입력해주세요'
              className='input-bordered input-primary input w-full'
              {...register('name')}
            />
            <ErrorMessageInput>
              {errors.name ? errors.name.message : ''}
            </ErrorMessageInput>
          </div>
          <div className='form-control w-full max-w-md'>
            <label className='label'>
              <span className='label-text'>아이디 입력</span>
            </label>
            <input
              type='text'
              placeholder='아이디를 입력해주세요'
              className={`input-bordered input-primary input w-full ${
                usernameCheck && `bg-gray-200`
              }`}
              readOnly={usernameCheck}
              {...register('username')}
            />
            {!usernameCheck && (
              <button
                type='button'
                className='btn mt-1'
                onClick={checkUsernameDuplication}
              >
                아이디 체크
              </button>
            )}
            <ErrorMessageInput>
              {errors.username ? errors.username.message : ''}
            </ErrorMessageInput>
          </div>
          <div className='form-control w-full max-w-md'>
            <label className='label'>
              <span className='label-text'>비밀번호 입력</span>
            </label>
            <input
              type='password'
              placeholder='비밀번호를 입력해주세요'
              className='input-bordered input-primary input w-full'
              {...register('password')}
            />
            <ErrorMessageInput>
              {errors.password ? errors.password.message : ''}
            </ErrorMessageInput>
          </div>
          <div className='form-control w-full max-w-md'>
            <label className='label'>
              <span className='label-text'>비밀번호 확인</span>
            </label>
            <input
              type='password'
              placeholder='비밀번호를 한번 더 입력해주세요'
              className='input-bordered input-primary input w-full'
              {...register('passwordCheck')}
            />
            <ErrorMessageInput>
              {errors.passwordCheck ? errors.passwordCheck.message : ''}
            </ErrorMessageInput>
          </div>
          <div className='w-full max-w-md items-center justify-center'>
            <input
              type='checkbox'
              className='checkbox-primary checkbox'
              {...register('agree')}
            />
            <label className='ml-2 cursor-pointer'>
              <span className='text-gray-500'>
                <Link
                  className='link-primary link'
                  href='https://plip.kr/pcc/1bdbcbd7-0bde-4101-8ce2-cc4e1fc53eef/consent/1.html'
                  target='_blank'
                >
                  개인정보 수집 및 이용
                </Link>
                {' 및 '}
                <Link
                  className='link-primary link'
                  href='https://www.plip.kr/pcc/1bdbcbd7-0bde-4101-8ce2-cc4e1fc53eef/privacy-policy'
                  target='_blank'
                >
                  개인정보 처리방침
                </Link>
                에 동의합니다.
              </span>
            </label>
            <ErrorMessageInput>
              {errors.agree ? errors.agree.message : ''}
            </ErrorMessageInput>
          </div>
          <button className='btn-primary btn-wide btn mt-4' type='submit'>
            회원가입
          </button>
        </form>
      </TabLayout>
      <Footer />
      <BottomBar tab='profile' />
    </>
  );
};

export default Signup;
