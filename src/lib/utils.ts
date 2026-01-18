import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { jwtDecode, JwtPayload as DefaultPayload } from 'jwt-decode';
import { User } from '@/types/user';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// LocalStorage Utilities

/**
 * Set a key-value pair in localStorage.
 * Automatically serializes the value to JSON.
 */
export function setItem<T>(key: string, value: T): void {
  try {
    const json = JSON.stringify(value);
    localStorage.setItem(key, json);
  } catch (err) {
    // localStorage error handled silently
  }
}

/**
 * Get a value from localStorage.
 * Automatically parses JSON back to the original type.
 */
export function getItem<T>(key: string): T | null {
  try {
    if (typeof window === 'undefined') return null;

    const json = localStorage.getItem(key);
    return json ? (JSON.parse(json) as T) : null;
  } catch (err) {
    return null;
  }
}

/**
 * Clear a specific key from localStorage.
 */
export function clearItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    // localStorage error handled silently
  }
}

/**
 * Get logged in user Info.
 */
export function getLoggedInUser(): User | null {
  const token = getItem<string>('token'); // token is a string, not any
  const user: User | null = token ? (decodeToken(token) as User) : null;

  if (!user) {
    return null;
  }

  return user;
}

/**
 * Check if the current user is an admin for the given organization.
 */
export const isAdminForCurrentOrg = (org: string | string[] | undefined): boolean => {
  if (!org || Array.isArray(org)) return false;

  const user = getLoggedInUser();
  return user?.role === 'admin' && user?.org_slug === org;
};

export function logout(): void {
  clearItem('token');
}

export function decodeToken<T extends object = DefaultPayload>(token: string): T | null {
  try {
    return jwtDecode<T>(token);
  } catch {
    return null;
  }
}
