import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { Dispatch, ReactElement, SetStateAction } from 'react';
import { AiOutlineGoogle } from 'react-icons/ai';

type Props = {
  btnText: string;
  title: string;
  description: ReactElement;
  link: string;
  setIsMobileMenuOpen?: Dispatch<SetStateAction<boolean>>;
};

export default function LoginModal({
  btnText,
  title,
  description,
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
        className='text-[0.8rem]'
      >
        {btnText}
      </Button>
      <Modal backdrop='blur' isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                <p className='text-center'>{title}</p>
              </ModalHeader>
              <ModalBody>{description}</ModalBody>
              <ModalFooter className='flex-col justify-center gap-2'>
                <Button
                  color='primary'
                  variant='shadow'
                  fullWidth
                  onPress={handleLogin}
                  startContent={<AiOutlineGoogle className='h-6 w-6 text-lg' />}
                >
                  {title}하기
                </Button>
                <Button
                  color='secondary'
                  variant='light'
                  fullWidth
                  onPress={handleNativeLogin}
                >
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
