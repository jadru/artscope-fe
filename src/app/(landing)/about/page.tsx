'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { LuPlusCircle, LuUsers } from 'react-icons/lu';

import NavBar from '@/components/Navbar';

export default function LandingPage() {
  return (
    <div className='min-h-screen'>
      <NavBar theme='light' />
      <div className='p-4 md:p-16'>
        <HeroSection />
        <FeatureSection />
      </div>
    </div>
  );
}

const HeroSection = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className='background-animate flex h-96 w-full flex-col items-center justify-center rounded-[3rem] border-2 border-white bg-gradient-to-r from-green-200 via-orange-200 to-yellow-300 px-12 drop-shadow-2xl'
  >
    <h1 className='break-keep font-serif text-4xl text-black'>
      예술가들의 성장과 교류를 위한 커뮤니티, Artscope
    </h1>
  </motion.div>
);

const FeatureSection = () => (
  <div className='flex flex-col md:flex-row'>
    <div className='flex h-48 w-full flex-col items-center justify-center gap-2 md:w-1/4'>
      <LuPlusCircle size={35} />
      <p className='text-xl font-bold'>작품 등록</p>
      <p>작품 등록 설명</p>
    </div>
    <div className='flex h-48 w-full flex-col items-center justify-center gap-2 md:w-1/4'>
      <LuPlusCircle size={35} />
      <p className='text-xl font-bold'>예술가 검색</p>
      <p>작품 등록 설명</p>
    </div>
    <div className='flex h-48 w-full flex-col items-center justify-center gap-2 md:w-1/4'>
      <LuUsers size={35} />
      <p className='text-xl font-bold'>소통과 토론</p>
      <p>작품 등록 설명</p>
    </div>
    <div className='flex h-48 w-full flex-col items-center justify-center gap-2 md:w-1/4'>
      <LuPlusCircle size={35} />
      <p className='text-xl font-bold'>이벤트</p>
      <p>작품 등록 설명</p>
    </div>
  </div>
);
