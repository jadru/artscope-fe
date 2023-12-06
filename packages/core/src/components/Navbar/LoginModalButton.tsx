import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { Lottie } from '@toss/lottie';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import { AiOutlineGoogle } from 'react-icons/ai';

type Props = {
  btnText: string;
  title: string;
  link: string;
  setIsMobileMenuOpen?: Dispatch<SetStateAction<boolean>>;
};

export default function LoginModal({
  btnText,
  title,
  link,
  setIsMobileMenuOpen,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { push } = useRouter();
  const handleLogin = () => {
    setIsMobileMenuOpen && setIsMobileMenuOpen(false);
    push(link);
    onClose();
  };
  const handleNativeLogin = () => {
    setIsMobileMenuOpen && setIsMobileMenuOpen(false);
    push('/user/login');
    onClose();
  };
  return (
    <>
      <Button
        onPress={onOpen}
        variant='flat'
        color='primary'
        className='text-[0.8rem]'>
        {btnText}
      </Button>
      <Modal backdrop='blur' isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                <p className='text-center'>{title}</p>
              </ModalHeader>
              <ModalBody>
                <Lottie
                  src='/animation/artist-drawing.json'
                  className='h-48 w-full'
                  autoPlay
                  loop
                />
                <p className='text-xl font-bold'>
                  창의적인 예술가들의 성장과 교류 커뮤니티 Artscope!
                </p>
                <p>
                  <b className='font-bold text-blue-600'>
                    작품 등록, 예술가 검색, 소통 기능, 프로젝트 제안, 예술 관련
                    정보 제공 등
                  </b>{' '}
                  다양한 기능을 회원가입하고 시작해보세요!
                </p>
                <p>
                  다양한 예술가들과 기획자들이 여러분을 기다리고 있습니다. 함께
                  예술을 만들어가는 즐거움을 느껴보세요.
                </p>
              </ModalBody>
              <ModalFooter className='flex-col justify-center gap-2'>
                <Button
                  color='primary'
                  variant='shadow'
                  fullWidth
                  onPress={handleLogin}
                  startContent={
                    <AiOutlineGoogle className='h-6 w-6 text-lg' />
                  }>
                  {title}하기
                </Button>
                <Button
                  color='secondary'
                  variant='light'
                  fullWidth
                  onPress={handleNativeLogin}>
                  이메일로 로그인 / 회원가입하기
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
