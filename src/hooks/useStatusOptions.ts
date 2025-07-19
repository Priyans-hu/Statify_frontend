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
    1: 'bg-green-600', // operational
    2: 'bg-yellow-600', // degraded
    3: 'bg-orange-500', // partial outage
    4: 'bg-red-700', // major outage
  };

  const statusCodeToString = (statusCode: number): string => {
    const match = statusOptions.find((opt) => opt.id === statusCode);
    return match?.status || 'Unknown';
  };

  const statusCodeToColor = (statusCode: number): string => {
    return statusColorMap[statusCode] || 'bg-gray-500';
  };

  const statusLabelToColor = (status: string): string => {
    const normalized = status.toLowerCase();
    if (normalized.includes('operational')) return 'bg-green-600';
    if (normalized.includes('degraded')) return 'bg-yellow-600';
    if (normalized.includes('partial')) return 'bg-orange-500';
    if (normalized.includes('outage')) return 'bg-red-700';
    return 'bg-gray-500';
  };

  return {
    statusOptions,
    statusCodeToString,
    statusCodeToColor,
    statusLabelToColor,
  };
};
