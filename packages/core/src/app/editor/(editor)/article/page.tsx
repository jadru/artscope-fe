/**
 * v0 by Vercel.
 * @see https://v0.dev/t/YkbEDxsoXWP
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { BiHeart } from 'react-icons/bi';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';

export default function Component() {
  return (
    <>
      <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
            <div className='flex flex-col'>
              <CardTitle className='text-base font-semibold'>
                Introducing Acme's New Product
              </CardTitle>
              <CardDescription className='text-sm'>
                Check out the latest innovation from Acme Inc. Our team has been
                working hard to bring you this amazing product.
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
    </>
  );
}
