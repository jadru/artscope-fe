'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox, Input } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import ErrorMessageInput from '@/components/ErrorMessageInput';

import signupSchema, { SignupInputs } from '@/app/user/signup/signupSchema';
import jxios from '@/utils/jxios';

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    getValues,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupInputs>({
    resolver: yupResolver<SignupInputs>(signupSchema),
    mode: 'onBlur',
  });
  const { push } = useRouter();
  const [emailCheck, setEmailCheck] = React.useState<boolean>(false);
  const [usernameCheck, setUsernameCheck] = React.useState<boolean>(false);

  const onSubmit: SubmitHandler<SignupInputs> = async (data) => {
    if (isSubmitting) return;
    if (!emailCheck) toast.warn('이메일이 중복됩니다.');
    if (!usernameCheck) toast.warn('아이디가 중복됩니다.');
    if (!isSubmitting && emailCheck && usernameCheck) {
      delete data.passwordCheck;
      delete data.agree;
      clearErrors();
      await jxios.post('/api/members', data).then(async () => {
        await jxios
          .post('/api/mail/authenticate', undefined, {
            params: { email: data.email },
          })
          .then(async () => {
            push('/user/email/verification');
            toast.success(data.email + '로 보낸 이메일 인증을 완료해주세요.');
          });
      });
    }
  };

  const checkEmailDuplication = () => {
    const regex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
    if (regex.test(getValues('email'))) {
      jxios
        .get('/api/members/email/' + getValues('email'))
        .then((response) => {
          if (response.status === 200) {
            setEmailCheck(true);
            toast.success('사용 가능한 이메일입니다.');
            clearErrors('email');
          }
        })
        .catch(() => {
          setError('email', {
            type: 'manual',
            message: '이미 사용중인 이메일입니다.',
          });
          toast.warn('이미 사용중인 이메일입니다.');
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
        .get('/api/members/username/' + getValues('username'))
        .then((response) => {
          if (response.status === 200) {
            setUsernameCheck(true);
            toast.success('사용 가능한 아이디입니다.');
            clearErrors('username');
          }
        })
        .catch(() => {
          setError('username', {
            type: 'manual',
            message: '이미 사용중인 아이디입니다.',
          });
          toast.warn('이미 사용중인 아이디입니다.');
          setUsernameCheck(false);
        });
    } else {
      toast.warn('아이디는 영문, 숫자 4~12자리로 입력해주세요.');
    }
  };

  return (
    <form className='space-y-2' onSubmit={handleSubmit(onSubmit)}>
      <Input
        type='email'
        label='이메일'
        variant='bordered'
        placeholder='asdf@asdf.com'
        errorMessage={errors.email?.message}
        onFocusChange={(isFocus) => {
          if (!isFocus) {
            checkEmailDuplication();
          }
        }}
        isInvalid={!!errors.email}
        {...register('email')}
      />
      <Input
        type='text'
        label='활동명'
        variant='bordered'
        placeholder='길동홍'
        errorMessage={errors.name?.message}
        isInvalid={!!errors.name}
        {...register('name')}
      />
      <Input
        type='text'
        label='아이디'
        variant='bordered'
        placeholder='gil-dong-hong'
        onFocusChange={(isFocused) => {
          if (
            !isFocused &&
            watch('username') &&
            errors.username === undefined
          ) {
            checkUsernameDuplication();
          }
        }}
        errorMessage={errors.username?.message}
        isInvalid={!!errors.username}
        {...register('username')}
      />
      <Input
        type='password'
        label='비밀번호'
        variant='bordered'
        placeholder='****'
        errorMessage={errors.password?.message}
        isInvalid={!!errors.password}
        {...register('password')}
      />
      <Input
        type='password'
        label='비밀번호 확인'
        variant='bordered'
        placeholder='****'
        errorMessage={errors.passwordCheck?.message}
        isInvalid={!!errors.passwordCheck}
        {...register('passwordCheck')}
      />
      <div className='w-full max-w-md items-center justify-center'>
        <Checkbox
          {...register('agree')}
          onValueChange={(isSelected) => setValue('agree', isSelected)}
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
      <Button type='submit' variant='shadow' color='primary' fullWidth>
        회원가입
      </Button>
    </form>
  );
};

export default SignupForm;
