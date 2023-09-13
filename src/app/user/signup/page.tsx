import Title from '@/components/Title';

import SignupForm from '@/app/user/signup/SignupForm';

const SignupPage = () => {
  return (
    <>
      <Title>회원가입</Title>
      <div className='mx-auto my-8 flex max-w-md flex-col items-stretch gap-2 p-4'>
        <SignupForm />
      </div>
    </>
  );
};

export default SignupPage;
