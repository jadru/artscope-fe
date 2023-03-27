import React from 'react';

const Summer2023KS = () => (
  <div className='min-h-full min-w-full bg-white'>
    <div className='hero min-h-screen bg-black text-white'>
      <video
        className='fixed z-0 sm:w-4/5 md:w-1/3'
        src={require('~/videos/banner_1.webm')}
        loop
        autoPlay
        muted
      />
      <div className='hero-content flex-col lg:flex-row'>
        <div>
          <h1 className='text-5xl font-bold mix-blend-overlay'>금샘미술관</h1>
          <p className='py-6'>
            금샘미술관은 금정미술관 내부에 위치해 있으며, 독자적인 기획과 작가
            네트워크를 통해 변화하는 시각적인 흐름을 담아 전시 콘텐츠를 활성화
            시키고자 하는 금정구의 고유한 미술관으로 탈바꿈 하고자 합니다.
            금샘미술관에서 새로운 창작 언어를 모색하는 작가들에게 작품을
            공모합니다. 자신만의 언어와 표현법으로 이야기를 펼치고 있는 모든
            작가들이 새롭게 준비하고 있는 플랫폼을 통해 작품을 공개할 수 있는
            기회를 마련하고자 합니다. 미술관의 높은 문턱과 전시의 기회가 쉽지
            않은 숨은 작가들에게 귀중한 발표의 장으로도 활용될 것입니다.
            시각언어와 예술이 다양한 만남과 화학적 변화를 이루고 있는 시기에,
            온라인 플랫폼을 개방하여 변화와 혁신들을 직접 눈으로 살펴볼 수 있는
            계기를 마련하고자 합니다. 제출된 작품 중 기획적으로 선별된 작품들은
            공모전의 형식으로 금샘미술관 전시실에서 전시를 가지게 됩니다.
            콘텐츠와 지역, 공간과 작가들의 의미있는 만남이 온라인과 오프
            공간에서 동시에 열리게 되는 이번 공모기획에 많은 응모와 지원
            바랍니다.
          </p>
        </div>
      </div>
    </div>
    <div className='hero relative z-10 min-h-screen bg-white/75 text-black'>
      <div className='hero-content flex-col lg:flex-row'>
        <div>
          <h1 className='text-5xl font-bold mix-blend-overlay'>자격</h1>
          <p className='py-6'>
            자신만의 스토리, 표현형식과 재료를 탐구하는 모든 작가, 크리에이터
          </p>
        </div>
        <div>
          <h1 className='text-5xl font-bold mix-blend-overlay'>작품 형식</h1>
          <p className='py-6'>
            회화, 사진, 아이패드나 유틸리티로 제작된 디지털 이미지, 카툰,
            일러스트나 디자인 등의 평면
            <br /> 설치미술, 조각, 독창적 크리쳐등의 3차원의 입체적 작품
            (제출시에는 이미지) <br />
            영상단편, 미디어아트, 사운드아트 등의 디지털 미디어 작품 (제출시는
            표기된 포맷) <br />
            제출시에 작품명/재료/작업연도 표기 <br />
            작품의 테마(주제)나 관련 키워드를 표기 <br />
            간단한 작가 이력 / 작품의 재료, 창작기법, 간단한 설명을 함께 표기{' '}
            <br />
            평면, 입체, 미디어 작업의 포맷을 차후 정리 (jpg.mov.png.10매가 이내
            용량등등)
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default Summer2023KS;
