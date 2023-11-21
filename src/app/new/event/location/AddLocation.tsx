import {
  Input,
  Kbd,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Pagination,
  useDisclosure,
} from '@nextui-org/react';
import { useDebounce } from '@toss/react';
import React, { useEffect, useState } from 'react';
import { BiBuilding, BiPlus } from 'react-icons/bi';

import NewLocationModal from '@/app/new/event/location/NewLocationModal';
import jxios from '@/utils/jxios';

import { CreateScheduleTempType } from '@/types/event';
import { LocationDataType, LocationResponseType } from '@/types/location';

export default function AddLocation({
  schedule,
  setSchedule,
  scheduleIndex,
}: {
  schedule: CreateScheduleTempType[];
  setSchedule: React.Dispatch<React.SetStateAction<CreateScheduleTempType[]>>;
  scheduleIndex: number;
}) {
  const [data, setData] = useState<LocationDataType[]>();
  const [keyword, setKeyword] = useState<string>('');
  const [page, setPage] = useState<number>(-1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: NewLocationisOpen,
    onOpen: NewLocationOnOpen,
    onOpenChange: NewLocationOnOpenChange,
    onClose: NewLocationOnClose,
  } = useDisclosure();

  const fetchLocations = useDebounce(
    async () =>
      jxios
        .get('/api/location/search', {
          params: {
            keyword,
            page: page + 1,
          },
        })
        .then((res) => {
          const data = res.data as LocationResponseType;
          setData(data.locations);
          setTotalPage(data.pageInfo.totalPages);
        }),
    500
  );

  const handleLocationClick = (location: LocationDataType) => {
    setSchedule((prev) => {
      const newSchedule = [...prev];
      newSchedule[scheduleIndex].locationId = location.locationId;
      newSchedule[scheduleIndex].locationName = location.name;
      return newSchedule;
    });
    onClose();
  };

  useEffect(() => {
    fetchLocations();
  }, [keyword, fetchLocations, page]);

  return (
    <>
      <button
        className='flex h-12 w-44 items-center justify-center rounded-xl border px-2 hover:bg-default-100'
        onClick={() => onOpen()}
      >
        {schedule[scheduleIndex].locationId ? (
          <>
            <BiBuilding size={23} />
            <p className='ml-1 mt-0.5'>
              {schedule[scheduleIndex].locationName}
            </p>
          </>
        ) : (
          <>
            <BiPlus size={23} />
            <p className='ml-1 mt-0.5'>장소 선택</p>
          </>
        )}
      </button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader>주소 선택</ModalHeader>
              <ModalBody>
                <div className='flex items-center justify-between gap-1 px-3'>
                  <Input
                    className='h-12'
                    placeholder='장소를 검색하세요.'
                    onValueChange={setKeyword}
                    endContent={<Kbd keys={['enter']} />}
                  />
                  <button
                    className='order-default-500 flex items-center gap-1 break-keep rounded-xl border-2 px-3 py-2 hover:bg-default-100'
                    onClick={NewLocationOnOpen}
                  >
                    <BiPlus size={23} />
                    <p>장소추가</p>
                  </button>
                </div>
                <div className='relative min-h-[200px] overflow-y-scroll px-3'>
                  {data &&
                    data?.map((location) => (
                      <div
                        className='cursor-pointer border-b py-2 hover:underline'
                        key={location.locationId}
                        onClick={() => handleLocationClick(location)}
                      >
                        <h5>
                          <b>{location.name}</b>
                        </h5>
                        <p>{location.address}</p>
                      </div>
                    ))}
                  {totalPage > 1 && (
                    <Pagination total={totalPage} onChange={setPage} />
                  )}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <NewLocationModal
        setSchedule={setSchedule}
        scheduleIndex={scheduleIndex}
        NewLocationisOpen={NewLocationisOpen}
        NewLocationOnOpenChange={NewLocationOnOpenChange}
        NewLocationOnClose={NewLocationOnClose}
        AddLocationModalOnClose={onClose}
      />
    </>
  );
}
