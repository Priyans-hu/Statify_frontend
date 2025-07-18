"use client";
import { setLoading } from '@/features/loading/loadingSlice';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AuthModal from './authModal';
import { getLoggedInUser, logout } from '@/lib/utils';
import { UserOutlined } from '@ant-design/icons';

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleClick = (path: string) => {
    dispatch(setLoading(true));
    router.push(path);
  };

  useEffect(() => {
    setIsLoggedIn(!!getLoggedInUser());
  }, []);

  const handleLogout = () => {
    dispatch(setLoading(true));
    logout();
    setIsLoggedIn(false);
    dispatch(setLoading(true));
  }

  return (
    <>
    <AuthModal
      visible={showAuthModal}
      onClose={() => setShowAuthModal(false)} />
      <nav className="p-4 flex justify-between items-center shadow border-b">
        <div className="flex gap-6">
          <Button type="text" onClick={() => handleClick("/")}>
            Home
          </Button>
          <Button type="text" onClick={() => handleClick("/status")}>
            Status
          </Button>
          <Button type="text" onClick={() => handleClick("/dashboard")}>
            Dashboard
          </Button>
        </div>

        <div>
          {!isLoggedIn ? (
          <Button type="text" onClick={() => setShowAuthModal(true)}>
            Login / Register
          </Button>
          ) : 
          (
          <Button type="text" onClick={() => handleLogout()}>
            <UserOutlined/> Logout
          </Button>
          )}
        </div>
      </nav>
      </>
  );
}
