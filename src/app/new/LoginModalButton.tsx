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
import { ReactElement } from 'react';
import { AiOutlineGoogle } from 'react-icons/ai';

type Props = {
  btnText: string;
  title: string;
  description: ReactElement;
  link: string;
};

export default function LoginModal({
  btnText,
  title,
  description,
  link,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { push } = useRouter();
  const handleLogin = () => {
    push(link);
  };
  return (
    <>
      <Button onPress={onOpen} color='primary'>
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
              <ModalFooter className='justify-center'>
                <Button
                  color='warning'
                  variant='flat'
                  onPress={handleLogin}
                  startContent={<AiOutlineGoogle className='h-6 w-6 text-lg' />}
                >
                  {title}하기
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
