'use client';

import { setLoading } from '@/features/loading/loadingSlice';
import { Button, Dropdown, MenuProps, Tooltip } from 'antd';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthModal from './authModal';
import { getLoggedInUser, logout } from '@/lib/utils';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import { setLoggedIn } from '@/features/loggedIn/loggedInSlice';

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const org = params?.org as string | undefined;
  const loggedIn = useSelector((state: any) => state.loggedIn.loggedIn);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<any | null>(null);

  const handleClick = (path: string) => {
    if (org) {
      const targetPath = `/${org}${path}`;
      if (pathname !== targetPath) {
        dispatch(setLoading(true));
        router.push(targetPath);
      }
    } else {
      const targetPath = path;
      if (pathname !== targetPath) {
        dispatch(setLoading(true));
        router.push(targetPath);
      }
    }
  };

  const formatOrgName = (slug: string): string => {
    return slug
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  useEffect(() => {
    const user = getLoggedInUser();
    if (user || (loggedIn && user)) {
      if (!loggedInUser) {
        setLoggedInUser(user);
      }
      if (!loggedIn) {
        dispatch(setLoggedIn(true));
      }
    } else {
      setLoggedInUser(null);
      if (loggedIn) {
        dispatch(setLoggedIn(false));
      }
    }
  }, [loggedIn]);

  const handleLogout = () => {
    logout();
    dispatch(setLoggedIn(false));
    toast.success('Logged out successfully');

    const targetPath = `/${org}/status`;
    if (pathname !== targetPath) {
      dispatch(setLoading(true));
      router.push(targetPath);
    }
  };

  const items: MenuProps['items'] = [
    {
      key: 'user',
      label: `Signed In As ${loggedInUser?.username || ''}`,
      onClick: () => {
        toast.info(`Hello ` + (loggedInUser?.username || 'User'));
      },
    },
    {
      key: 'logout',
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <AuthModal visible={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <nav className="fixed top-0 left-0 w-full z-50 p-4 flex justify-between items-center bg-[#131a26] !text-white">
        <div className="flex gap-6">
          <Button
            type="text"
            onClick={() => handleClick('/status')}
            className="!text-white !text-lg !font-semibold"
          >
            Statify {org && ' | ' + formatOrgName(org)}
          </Button>
          {!pathname?.endsWith('/dashboard') && loggedIn && loggedInUser?.role === 'admin' && (
            <Button
              type="text"
              onClick={() => handleClick('/dashboard')}
              className="!text-white !text-lg !font-semibold"
            >
              Dashboard
            </Button>
          )}
        </div>

        {pathname !== '/' && (
          <div>
            {!loggedInUser ? (
              <Button
                type="text"
                onClick={() => setShowAuthModal(true)}
                className="!text-white !text-lg !font-semibold"
              >
                Login / Register
              </Button>
            ) : (
              <Dropdown menu={{ items }} trigger={['click']}>
                <Button
                  type="text"
                  className="!text-white !text-lg !font-semibold capitalize flex items-center gap-2"
                >
                  <UserOutlined />
                  {loggedInUser?.role || 'viewer'}
                  <DownOutlined />
                </Button>
              </Dropdown>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
