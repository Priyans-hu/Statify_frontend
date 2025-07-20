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
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const org = params?.org as string | undefined;
  const [userRole, setUserRole] = useState<string | null>(null);

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

  useEffect(() => {
    const user = getLoggedInUser();
    if (user && user.role) {
      setUserRole(user.role);
      setIsLoggedIn(true);
    } else {
      setUserRole(null);
      setIsLoggedIn(false);
    }
  }, []);

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
    router.push(`/${org}/status`);
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
          {isLoggedIn ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="text"
                  className="!text-white !text-lg !font-semibold flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <UserOutlined />
                  Logout
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center">
                <p className="text-sm">
                  Logged in as <strong>{userRole?.toUpperCase() || 'User'}</strong>
                </p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              type="text"
              onClick={() => setShowAuthModal(true)}
              className="!text-white !text-lg !font-semibold"
            >
              Login / Register
            </Button>
          )}
        </div>
      </nav>
    </>
  );
}
