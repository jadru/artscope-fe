import Title from '@/components/Title';

import SignupForm from '@/app/user/signup/SignupForm';

const SignupPage = () => {
  return (
    <>
      <div className='mx-auto flex max-w-md flex-col items-stretch gap-2 p-4'>
        <Title>회원가입</Title>
        <SignupForm />
      </div>
    </>
  );
};

export default SignupPage;
