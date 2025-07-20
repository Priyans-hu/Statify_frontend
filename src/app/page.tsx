'use client';

import { setLoading } from '@/features/loading/loadingSlice';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import api from '@/lib/api';
import { Organization } from '@/types/organization';
import { useRouter } from 'next/navigation';
import { Select } from 'antd';

const { Option } = Select;

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    dispatch(setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    const cached = sessionStorage.getItem('organizations');
    if (cached) {
      setOrganizations(JSON.parse(cached));
      return;
    }

    const fetchOrganizations = async () => {
      try {
        const response = await api.get('/organizations');
        setOrganizations(response.data as Organization[]);
        sessionStorage.setItem('organizations', JSON.stringify(response.data));
      } catch (err: any) {
        console.error('Failed to fetch organizations', err);
        toast.error(err.response?.data?.message || 'Failed to fetch organizations');
      }
    };

    fetchOrganizations();
  }, []);

  const handleSelect = (orgSlug: string) => {
    router.push(`/${orgSlug}/status`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#131a26] text-white px-4">
      <h1 className="text-4xl font-bold mb-2">Status Dashboard</h1>
      <p className="text-gray-300 mb-6">Monitor system health in real-time</p>

      {organizations.length > 0 ? (
        <>
          <p className="mb-2">Choose an organization to view its statuses:</p>
          <Select
            showSearch
            placeholder="Select an organization"
            optionFilterProp="children"
            className="min-w-[250px]"
            onSelect={handleSelect}
            filterOption={(input, option) =>
              typeof option?.children === 'string' &&
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {organizations.map((org) => (
              <Option key={org.id} value={org.slug}>
                {org.name}
              </Option>
            ))}
          </Select>
        </>
      ) : (
        <p>Loading organizations...</p>
      )}
    </main>
  );
}
