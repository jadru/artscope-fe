import { Lottie } from '@toss/lottie';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import { AiOutlineGoogle } from 'react-icons/ai';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";

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
  const { push } = useRouter();
  const handleLogin = () => {
    setIsMobileMenuOpen && setIsMobileMenuOpen(false);
    push(link);
  };
  const handleNativeLogin = () => {
    setIsMobileMenuOpen && setIsMobileMenuOpen(false);
    push('/user/login');
  };
  return (

      <Dialog>
        <DialogTrigger asChild>
          <Button>{btnText}</Button>
        </DialogTrigger>

      <DialogContent>
        <DialogHeader>{title}</DialogHeader>
        <DialogDescription>
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
            </b>
            다양한 기능을 회원가입하고 시작해보세요!
          </p>
          <p>
            다양한 예술가들과 기획자들이 여러분을 기다리고 있습니다. 함께
            예술을 만들어가는 즐거움을 느껴보세요.
          </p></DialogDescription>

          <Button>
            <AiOutlineGoogle /> {title} 하기
          </Button>
          <Button onClick={handleNativeLogin}>
            이메일로 로그인 / 회원가입하기
          </Button>

      </DialogContent>
    </Dialog>

  );
}
