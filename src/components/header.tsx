"use client";
import { setLoading } from '@/features/loading/loadingSlice';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleClick = (path: string) => {
    dispatch(setLoading(true));
    router.push(path);
  };

  return (
    <nav className='p-4 flex gap-6 shadow border-b'>
      <Button type='text' onClick={() => handleClick('/')}>
        Home
      </Button>
      <Button type='text' onClick={() => handleClick('/status')}>
        Status
      </Button>
      <Button type='text' onClick={() => handleClick('/dashboard')}>
        Dashboard
      </Button>
    </nav>
  );
}
