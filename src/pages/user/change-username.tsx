import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { Cookies } from 'react-cookie';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import * as yup from 'yup';

import useAuth from '@/hooks/useAuth';

import ErrorMessageInput from '@/components/ErrorMessageInput';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';
import Title from '@/components/Title';

import { auth } from '@/api';
import { userNameAndRoleAtom } from '@/states/atom';
import jxios from '@/utils/jxios';

const usernameChangeSchema = yup.object().shape({
  username: yup.string(),
  newUsername: yup
    .string()
    .matches(
      new RegExp('^[a-zA-Z0-9]{4,12}$'),
      '아이디는 4~12자 및 숫자와 영어입니다.'
    )
    .required('새로운 아이디를 입력해주세요.'),
});
interface usernameChangeInputs {
  username: string;
  newUsername: string;
}
const ChangeUsernamePage = () => {
  useAuth();
  const cookies = useMemo(() => new Cookies(), []);
  const { push } = useRouter();
  const [firstUsernameValue, setUserValue] =
    useRecoilState(userNameAndRoleAtom);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<usernameChangeInputs>({
    resolver: yupResolver(usernameChangeSchema),
  });

  const onSubmit = (data: usernameChangeInputs) => {
    auth.username(data.newUsername).then((res) => {
      if (res.status === 400) {
        toast.warn(res.data);
      } else if (res.status === 200) {
        auth
          .changeusername(firstUsernameValue.username, data.newUsername)
          .then((res) => {
            if (res.data.success === false) {
              toast.error(res.data.message);
              return;
            }
            push('/user/login').then(() => {
              cookies.remove('refreshToken', { path: '/' });
              jxios.defaults.headers.common['Authorization'] = undefined;
              setUserValue({
                username: undefined,
                role: undefined,
                profileImage: undefined,
              });
              toast.success(
                '아이디가 변경되었습니다. ' +
                  data.newUsername +
                  '아이디로 로그인을 다시 해주세요'
              );
            });
          })
          .catch((err) => {
            toast.error(err.response.data);
          });
      }
    });
  };
  return (
    <>
      <Seo templateTitle='아이디 변경' />
      <NavBar />
      <TabLayout>
        <Title>아이디 변경</Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col space-y-2'>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>현재 아이디</span>
              </label>
              <input
                type='text'
                value={firstUsernameValue.username}
                className='input-bordered input'
                disabled={true}
                {...register('username')}
              />
            </div>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>새로운 아이디</span>
              </label>
              <input
                type='text'
                placeholder='아이디를 입력해주세요'
                className='input-bordered input'
                {...register('newUsername')}
              />
              <ErrorMessageInput>
                {errors.newUsername ? errors.newUsername.message : ''}
              </ErrorMessageInput>
            </div>
          </div>
          <div className='flex justify-end'>
            <button
              type='submit'
              className='btn-primary btn'
              disabled={isSubmitting}
            >
              {isSubmitting ? '변경 중...' : '변경'}
            </button>
          </div>
        </form>
      </TabLayout>
      <BottomBar tab='profile' />
      <Footer />
    </>
  );
};

export default ChangeUsernamePage;
