import { useEffect, useState } from 'react';
import axios from 'axios';
import Config from '@/constants/config';

type StatusOption = { id: number; status: string };

export const useStatusOptions = () => {
  const [statusOptions, setStatusOptions] = useState<StatusOption[]>([]);

  useEffect(() => {
    const fetchStatusOptions = async () => {
      try {
        const res = await axios.get(`${Config.API_BASE_URL}/status`);
        setStatusOptions(res.data);
      } catch (error) {
        console.error('Failed to load status options', error);
      }
    };
    fetchStatusOptions();
  }, []);

  const statusColorMap: Record<number, string> = {
    1: 'bg-green-600',
    2: 'bg-yellow-600',
    3: 'bg-orange-500',
    4: 'bg-red-700',
  };

  const statusCodeToString = (statusCode: number): string => {
    const match = statusOptions.find((opt) => opt.id === statusCode);
    return match?.status || 'Unknown';
  };

  const statusCodeToColor = (statusCode: number): string => {
    return statusColorMap[statusCode] || 'bg-gray-500';
  };

  return {
    statusOptions,
    statusCodeToString,
    statusCodeToColor,
  };
};
