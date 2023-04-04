import Image from 'next/image';
import React from 'react';

import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';

import { NEXT_PUBLIC_MEDIA_STORAGE_URL } from '@/constant/env';

const Summer2023KS = () => (
  <>
    <Seo templateTitle='2023 금샘 미술관 전시 작품 공모' />
    <NavBar title='ArtPlatform' black={true} />
    <TabLayout className='m-0 w-full bg-dark p-0 pt-0' paddingTop={true}>
      <Image
        src='static/exhibition/2023-01-03.jpeg'
        fill
        alt='background for exhibition'
        className='fixed opacity-30'
      />
      <div className='hero min-h-screen'>
        <div className='hero-content flex-col space-x-2 lg:flex-row'>
          <p className='text-xl font-thin text-gray-200'>
            {
              '<금샘미술관>에서 새로운 창작 언어를 모색하는 작가들에게 작품을 공모합니다. <금샘미술관>은 금정문화회관 내부에 위치해 있으며, 독자적인 기획과 작가 네트워크를 통해 변화하는 시각적인 흐름을 담아 전시 콘텐츠를 활성화시키고 있습니다. 한편으로는 미술관으로서의 정체성을 확립하여 금정구의 고유한 지역 미술관으로서 역할을 하고자 합니다. 자신만의 언어와 표현법으로 이야기를 펼치고 있는 모든 작가들이 새롭게 준비하고 있는 플랫폼을 통해 작품을 공개할 수 있는 기회를 마련하고자 합니다. 미술관의 높은 문턱과 전시의 기회가 쉽지 않은 숨은 작가들에게 귀중한 발표의 장으로도 활용될 것입니다. 시각언어와 예술이 다양한 만남과 화학적 변화를 이루고 있는 시기에, 온라인 플랫폼을 개방하여 변화와 혁신들을 직접 눈으로 살펴볼 수 있는 계기를 마련하고자 합니다. 제출된 작품 중 기획적으로 선별된 작품들은 공모전의 형식으로 금샘미술관 전시실에서 전시를 가지게 됩니다. 콘텐츠와 지역, 공간과 작가들의 의미 있는 만남이 온라인과 오프 공간에서 동시에 열리게 되는 이번 공모기획에 많은 응모와 지원 바랍니다.'
            }
          </p>
          <video className='w-full' loop autoPlay muted playsInline>
            <source
              src={`${NEXT_PUBLIC_MEDIA_STORAGE_URL}/static/banner_1.webm`}
              type='video/webm'
            />
          </video>
        </div>
      </div>
      <div className='hero min-h-screen w-full text-white'>
        <div className='hero-content flex-col'>
          <div>
            <p>
              💡 자격 : 자신만의 스토리, 표현형식과 재료를 탐구하는 만 45세
              이하의 모든 작가, 크리에이터, 창작자
            </p>
            <p>🥤 접수기간 : 2023. 04.01 - 05. 30</p>
            <p>
              📝 작품 형식 : 작품 형식, 쟝르, 융합, 디지털의 경계나 제한은 없음
            </p>
            <p>
              - 회화, 사진, 아이패드나 프로그램으로 제작된 디지털 이미지, 카툰,
              일러스트나 디자인 등의 평면
            </p>
            <p>
              - 설치미술, 조각, 독창적 크리쳐 등의 3차원의 입체적 작품
              (제출시에는 이미지)
            </p>
            <p>
              - 영상단편, 미디어아트, 사운드아트 등의 디지털 미디어 작품
              (제출시는 표기된 포맷)
            </p>
            <p>🖱️ 제출방식 : 온라인 제출</p>
            <p>- 제출시에 작품명 / 재료 / 작업연도 표기</p>
            <p>- 작품의 주제나 관련 키워드를 함께 표기</p>
            <p>
              - 간단한 설명을 함께 표기 : 간단한 작가 이력 / 작품의 재료 /
              창작기법 등
            </p>
            <p>
              - 평면, 입체, 미디어 작업의 포맷 : 이미지(jpg) 영상(mov.mp4)
              사운드 (wave.mp3)로 제출
            </p>
            <p>
              - 용량은 가능한 10MB 이내, 고화질이미지, 영상의 경우 10MB 이상도
              무방
            </p>
            <p>🖌️ 온라인 플랫폼 작가 등록 자격가이드</p>
            <p>
              플랫폼에 올린 작업들은 최소한의 관리자 검토를 거쳐 자격여부를
              드리게 됩니다.
            </p>
            <p>
              자격여부 검토 내용 - 표현언어나 내용, 기술, 창의성, 숙련도 부분
              최소한의 검토
            </p>
            <p>🖌️ 진행일정</p>
            <p>4월-5월 : 작품 제출 </p>
            <p>
              5월 중순 : 전시작가 선정 (플랫폼 피드백, 금샘미술관기획자,
              외부전문가)
            </p>
            <p> 6월 말 : 전시 오프닝</p>
          </div>
        </div>
      </div>
    </TabLayout>
    <BottomBar tab='playlist' dark />
  </>
);

export default Summer2023KS;
