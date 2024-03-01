/**
 * v0 by Vercel.
 * @see https://v0.dev/t/YkbEDxsoXWP
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from 'next/link';
import { BiHeart, BiSearch } from 'react-icons/bi';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';

export default function Component() {
  return (
    <div className='flex flex-col w-full min-h-screen'>
      <header className='flex items-center h-16 px-4 border-b shrink-0 md:px-6'>
        <nav className='flex-none hidden gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
          <Link
            className='flex items-center gap-2 text-lg font-semibold md:text-base'
            href='#'>
            Artscope
          </Link>
          <Link className='text-gray-500 dark:text-gray-400' href='#'>
            메인
          </Link>
          <Link className='font-bold' href='#'>
            내 아티클
          </Link>
          <Link className='text-gray-500 dark:text-gray-400' href='#'>
            설정
          </Link>
        </nav>
        <div className='flex items-center w-full gap-4 md:ml-auto md:gap-2 lg:gap-4'>
          <form className='flex-1 ml-auto sm:flex-initial'>
            <div className='relative'>
              <BiSearch className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400' />
              <Input
                className='pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]'
                placeholder='Search articles...'
                type='search'
              />
            </div>
          </form>
          <Button className='rounded-full' size='icon' variant='ghost'>
            <img
              alt='Avatar'
              className='rounded-full'
              height='32'
              src='/placeholder.svg'
              style={{
                aspectRatio: '32/32',
                objectFit: 'cover',
              }}
              width='32'
            />
            <span className='sr-only'>Toggle user menu</span>
          </Button>
        </div>
      </header>
      <main className='flex flex-1 flex-col p-4 md:p-6'>
        <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
              <div className='flex flex-col'>
                <CardTitle className='text-base font-semibold'>
                  Introducing Acme's New Product
                </CardTitle>
                <CardDescription className='text-sm'>
                  Check out the latest innovation from Acme Inc. Our team has
                  been working hard to bring you this amazing product.
                </CardDescription>
              </div>
              <Button className='rounded-full' size='icon' variant='ghost'>
                <BiHeart className='w-4 h-4' />
                <span className='sr-only'>Like</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className='grid gap-2 text-sm'>
                <p>
                  <strong>Author:</strong>
                  John Doe{'\n                              '}
                </p>
                <p>
                  <strong>Published:</strong>2 days ago
                  {'\n                              '}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
              <div className='flex flex-col'>
                <CardTitle className='text-base font-semibold'>
                  The Future of AI in Business
                </CardTitle>
                <CardDescription className='text-sm'>
                  How artificial intelligence is transforming industries and
                  creating new opportunities.
                </CardDescription>
              </div>
              <Button className='rounded-full' size='icon' variant='ghost'>
                <BiHeart className='w-4 h-4' />
                <span className='sr-only'>Like</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className='grid gap-2 text-sm'>
                <p>
                  <strong>Author:</strong>
                  Alice Johnson{'\n                              '}
                </p>
                <p>
                  <strong>Published:</strong>1 week ago
                  {'\n                              '}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
              <div className='flex flex-col'>
                <CardTitle className='text-base font-semibold'>
                  Mastering Productivity: Tips for Remote Workers
                </CardTitle>
                <CardDescription className='text-sm'>
                  Learn how to stay focused and make the most of your time when
                  working from home.
                </CardDescription>
              </div>
              <Button className='rounded-full' size='icon' variant='ghost'>
                <BiHeart className='w-4 h-4' />
                <span className='sr-only'>Like</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className='grid gap-2 text-sm'>
                <p>
                  <strong>Author:</strong>
                  Alex Smith{'\n                              '}
                </p>
                <p>
                  <strong>Published:</strong>3 days ago
                  {'\n                              '}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
              <div className='flex flex-col'>
                <CardTitle className='text-base font-semibold'>
                  The Art of Storytelling: Engaging Your Audience
                </CardTitle>
                <CardDescription className='text-sm'>
                  Tips for crafting compelling narratives that capture attention
                  and inspire action.
                </CardDescription>
              </div>
              <Button className='rounded-full' size='icon' variant='ghost'>
                <BiHeart className='w-4 h-4' />
                <span className='sr-only'>Like</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className='grid gap-2 text-sm'>
                <p>
                  <strong>Author:</strong>
                  Emily Jones{'\n                              '}
                </p>
                <p>
                  <strong>Published:</strong>4 days ago
                  {'\n                              '}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className='flex items-center justify-center w-full mt-8'>
          <Pagination />
        </div>
      </main>
    </div>
  );
}
