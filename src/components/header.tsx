'use client';

import { setLoading } from '@/features/loading/loadingSlice';
import { Button } from 'antd';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AuthModal from './authModal';
import { getLoggedInUser, logout } from '@/lib/utils';
import { UserOutlined } from '@ant-design/icons';
import { usePathname } from 'next/navigation';

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const org = params?.org as string | undefined;

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleClick = (path: string) => {
    dispatch(setLoading(true));
    if (org) {
      router.push(`/${org}${path}`);
    } else {
      router.push(path);
    }
  };

  const formatOrgName = (slug: string): string => {
    return slug
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  useEffect(() => {
    setIsLoggedIn(!!getLoggedInUser());
  }, []);

  const handleLogout = () => {
    dispatch(setLoading(true));
    logout();
    setIsLoggedIn(false);
    dispatch(setLoading(true));
  };

  return (
    <>
      <AuthModal visible={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <nav className="p-4 flex justify-between items-center !text-white">
        <div className="flex gap-6">
          <Button
            type="text"
            onClick={() => handleClick('/status')}
            className="!text-white !text-lg !font-semibold"
          >
            Statify {org && ' | ' + formatOrgName(org)}
          </Button>
          {!pathname?.endsWith('/dashboard') && (
            <Button
              type="text"
              onClick={() => handleClick('/dashboard')}
              className="!text-white !text-lg !font-semibold"
            >
              Dashboard
            </Button>
          )}
        </div>

        <div>
          {!isLoggedIn ? (
            <Button
              type="text"
              onClick={() => setShowAuthModal(true)}
              className="!text-white !text-lg !font-semibold"
            >
              Login / Register
            </Button>
          ) : (
            <Button
              type="text"
              onClick={handleLogout}
              className="!text-white !text-lg !font-semibold"
            >
              <UserOutlined /> Logout
            </Button>
          )}
        </div>
      </nav>
    </>
  );
}
