import FeedList from '@/app/new/FeedList';
import { mockupData } from '@/app/new/mockData';
import NewPostModal from '@/app/new/NewPostModalButton';
import UserInfo from '@/app/new/UserInfo';

export default function Page() {
  return (
    <>
      <div className='container mx-auto flex flex-col items-center justify-center border-y'>
        <div className='container max-w-screen-md border-x'>
          <div className='flex flex-row justify-start gap-2 space-y-1 p-3'>
            <UserInfo />
            <NewPostModal
              btnText='무슨 이야기가 있나요?'
              expandBtnText='확대'
              reduceBtnText='축소'
              cancelBtnText='취소'
              submitBtnText='작성'
              placeholder='내용을 입력하세요.'
            />
          </div>
          <FeedList data={mockupData} />
        </div>
      </div>
    </>
  );
}
