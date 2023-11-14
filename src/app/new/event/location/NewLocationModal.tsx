import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@nextui-org/react';
import { useState } from 'react';
import React from 'react';
import DaumPostcode, { Address } from 'react-daum-postcode';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import NewLocationSchema, {
  newLocationInputs,
} from '@/app/new/event/location/newLocationSchema';
import jxios from '@/utils/jxios';

import { CreateScheduleType } from '@/types/event';

export default function NewLocationModal({
  setSchedule,
  scheduleIndex,
  NewLocationisOpen,
  NewLocationOnClose,
  NewLocationOnOpenChange,
  AddLocationModalOnClose,
}: {
  setSchedule: React.Dispatch<React.SetStateAction<CreateScheduleType[]>>;
  scheduleIndex: number;
  NewLocationisOpen: boolean;
  NewLocationOnClose: () => void;
  NewLocationOnOpenChange: () => void;
  AddLocationModalOnClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<newLocationInputs>({
    resolver: yupResolver<newLocationInputs>(NewLocationSchema),
    mode: 'onBlur',
  });
  const [address, setAddress] = useState<
    | undefined
    | {
        address: string;
        longitude: number;
        latitude: number;
      }
  >();

  const completeHandler = (data: Address) => {
    jxios
      .get(`/kakaomap/local/search/address.json?query=${data.address}`, {
        headers: {
          Authorization: 'KakaoAK fe4ef4b5a5ff051e353f4b5e9f6ef4a9',
        },
      })
      .then((res) => {
        const { x, y } = res.data.documents[0];
        setAddress({
          address: data.address,
          longitude: Number(x),
          latitude: Number(y),
        });
      });
  };

  const onSubmit: SubmitHandler<newLocationInputs> = async (data) => {
    if (isSubmitting) return;
    if (!address) return toast.error('문제가 발생했습니다');
    jxios
      .post('/api/location', {
        address: address?.address,
        englishName: data.englishName,
        latitude: address?.latitude,
        longitude: address?.longitude,
        name: data.name,
        phoneNumber: data.phoneNumber,
        snsUrl: data.snsUrl,
        webSiteUrl: data.webSiteUrl,
      })
      .then((res) => {
        toast.success('장소가 등록되었습니다.');
        setSchedule((prev) => {
          const newSchedule = [...prev];
          newSchedule[scheduleIndex].locationId = res.data.id;
          newSchedule[scheduleIndex].locationName = res.data.name;
          return newSchedule;
        });
        AddLocationModalOnClose();
        NewLocationOnClose();
      })
      .catch(() => {
        toast.error('문제가 발생했습니다.');
      });
  };

  return (
    <Modal
      isOpen={NewLocationisOpen}
      onOpenChange={NewLocationOnOpenChange}
      size='full'
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader>주소 추가</ModalHeader>
            <ModalBody>
              <DaumPostcode
                onComplete={completeHandler}
                className='!h-full !w-full'
              />
              {address !== undefined && (
                <form
                  className='mx-auto flex w-full max-w-2xl flex-col gap-2'
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Input
                    label='장소 이름'
                    placeholder='금샘 미술관'
                    errorMessage={errors.name?.message}
                    isInvalid={!!errors.name}
                    {...register('name')}
                  />
                  <Input
                    label='장소 영어 이름'
                    placeholder='Geumsaem Art Gallery'
                    errorMessage={errors.englishName?.message}
                    isInvalid={!!errors.englishName}
                    {...register('englishName')}
                  />
                  <Input
                    type='url'
                    label='링크'
                    placeholder='홈페이지 등 관련 링크'
                    errorMessage={errors.webSiteUrl?.message}
                    isInvalid={!!errors.webSiteUrl}
                    {...register('webSiteUrl')}
                  />
                  <Input
                    type='url'
                    label='SNS 주소'
                    {...register('snsUrl')}
                    errorMessage={errors.snsUrl?.message}
                    isInvalid={!!errors.snsUrl}
                  />
                  <Input label='장소 전화번호' {...register('phoneNumber')} />
                  <Input disabled value={address?.address} label='주소' />
                  <Input
                    label='상세 주소'
                    {...register('detailAddress')}
                    errorMessage={errors.detailAddress?.message}
                    isInvalid={!!errors.detailAddress}
                  />
                  <Button
                    type='submit'
                    color='primary'
                    variant='shadow'
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                  >
                    장소 등록
                  </Button>
                </form>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
