import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { jwtDecode, JwtPayload as DefaultPayload } from "jwt-decode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
    console.error(`Error setting item "${key}" to localStorage`, err);
  }
}

/**
 * Get a value from localStorage.
 * Automatically parses JSON back to the original type.
 */
export function getItem<T>(key: string): T | null {
  try {
    const json = localStorage.getItem(key);
    return json ? (JSON.parse(json) as T) : null;
  } catch (err) {
    console.error(`Error getting item "${key}" from localStorage`, err);
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
    console.error(`Error clearing item "${key}" from localStorage`, err);
  }
}

/**
 * Get logged in user Info.
 */
export function getLoggedInUser(): any {
  const token = getItem<any>('token');
  const user = token ? decodeToken(token) : null;
  if (!user) {
    console.warn('No user found in localStorage');
    return null;
  }
  return user;
}

export function logout(): void {
  clearItem('token');
  window.location.reload();
}


export function decodeToken<T extends object = DefaultPayload>(token: string): T | null {
  try {
    return jwtDecode<T>(token);
  } catch {
    return null;
  }
}