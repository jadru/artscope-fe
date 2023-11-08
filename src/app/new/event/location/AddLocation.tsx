import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import { BiPlus, BiSearch } from 'react-icons/bi';
import { HiX } from 'react-icons/hi';

import { ScheduleType } from '@/types/event';

export default function AddLocation({
  _setSchedule,
  _scheduleIndex,
}: {
  _setSchedule: React.Dispatch<React.SetStateAction<ScheduleType[]>>;
  _scheduleIndex: number;
}) {
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [addressSelectorVisible, setAddressSelectorVisible] = useState(false);
  const [daumPostCodeVisible, setDaumPostCodeVisible] = useState(false);
  const [address, setAddress] = useState<undefined | string>();

  return (
    <>
      <button
        className='flex h-12 w-32 items-center justify-center rounded-xl border hover:bg-default-100'
        onClick={() => setLocationModalVisible(true)}
      >
        <BiPlus size={23} />
        <p className='ml-1 mt-0.5'>장소 선택</p>
      </button>
      {locationModalVisible && (
        <div className='fixed left-0 top-0 z-50 flex h-screen w-screen items-center bg-black/30'>
          <div className='mx-auto my-auto h-screen w-screen bg-white md:max-h-[600px] md:max-w-[824px]'>
            <div className='flex h-14 w-full items-center justify-between border-b px-4'>
              <h3 className='text-center'>주소 선택</h3>
              <button onClick={() => setLocationModalVisible(false)}>
                <HiX size={27} />
              </button>
            </div>
            <div className='flex items-center justify-between px-3'>
              <input className='h-12 w-1/2' placeholder='장소를 검색하세요.' />
              <button
                className='flex h-10 items-center gap-1 rounded-xl border-2 border-default-500 px-3 hover:bg-default-100'
                onClick={() => setAddressSelectorVisible(true)}
              >
                <BiPlus size={25} />
                <p className='mt-1'>장소 추가</p>
              </button>
            </div>
            <div className='relative h-screen overflow-y-scroll border-t px-3 md:h-[502px]'>
              <div className='cursor-pointer border-b py-2 hover:font-bold hover:underline'>
                <h5>어디 미술관</h5>
                <p>주소 1</p>
              </div>
              <div className='border-b py-2'>
                <h5>어디 미술관</h5>
                <p>주소 1</p>
              </div>
              <div className='border-b py-2'>
                <h5>어디 미술관</h5>
                <p>주소 1</p>
              </div>
              <div className='border-b py-2'>
                <h5>어디 미술관</h5>
                <p>주소 1</p>
              </div>
              <div className='border-b py-2'>
                <h5>어디 미술관</h5>
                <p>주소 1</p>
              </div>
              <div className='border-b py-2'>
                <h5>어디 미술관</h5>
                <p>주소 1</p>
              </div>
              <div className='border-b py-2'>
                <h5>어디 미술관</h5>
                <p>주소 1</p>
              </div>
              <div className='border-b py-2'>
                <h5>어디 미술관</h5>
                <p>주소 1</p>
              </div>
              <div className='border-b py-2'>
                <h5>어디 미술관</h5>
                <p>주소 1</p>
              </div>
              <div className='border-b py-2'>
                <h5>어디 미술관</h5>
                <p>주소 1</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {addressSelectorVisible && (
        <div className='fixed left-0 top-0 z-[51] flex h-screen w-screen items-center bg-black/50'>
          <div className='mx-auto my-auto h-screen w-screen bg-white md:max-h-[600px] md:max-w-[824px]'>
            <div className='flex h-14 w-full items-center justify-between border-b px-4'>
              <h3 className='text-center'>주소 추가</h3>
              <button onClick={() => setAddressSelectorVisible(false)}>
                <HiX size={27} />
              </button>
            </div>
            <div className='flex h-screen flex-col items-center justify-center gap-2 px-3 md:h-[544px]'>
              <form className='grid w-full grid-cols-1 gap-2 md:grid-cols-2'>
                <Input label='장소 이름' />
                <Select label='장소 타입'>
                  <SelectItem key='univ' value='강의실'>
                    강의실
                  </SelectItem>
                </Select>
                <Input label='장소 영어 이름' />
                <Input label='장소 링크' placeholder='홈페이지 등 관련 링크' />
                <Input label='SNS 주소' />
                <Input label='장소 전화번호' />
                <div className='flex justify-stretch gap-1'>
                  <Input disabled value={address} label='주소' />
                  <button
                    className='flex w-32 items-center justify-center rounded-2xl border-2 border-default-700 p-1.5'
                    onClick={() => {
                      setDaumPostCodeVisible(true);
                    }}
                  >
                    <BiSearch size={20} />
                    <p>찾기</p>
                  </button>
                </div>
                <Input label='상세 주소' />
              </form>
              <Button type='submit' color='primary'>
                장소 등록
              </Button>
            </div>
            {daumPostCodeVisible && (
              <div className='fixed left-0 top-0 z-[52] flex h-screen w-screen items-center bg-black/50'>
                <div className='mx-auto my-auto h-screen w-screen bg-white md:max-h-[400px] md:max-w-[424px]'>
                  <DaumPostcode
                    onComplete={(data) => {
                      setAddress(data.address);
                      setDaumPostCodeVisible(false);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
