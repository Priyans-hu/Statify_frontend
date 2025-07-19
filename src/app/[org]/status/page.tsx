'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/features/loading/loadingSlice';

import Config from '@/constants/config';
import { statusCodeToString, statusColorMap } from '@/lib/StatusUtils';

import ServiceCard from '@/components/serviceCard';
import IncidentTimeline from '@/components/IndicatorTimeline';

type Service = {
  id: number;
  name: string;
  status_code: number;
};

const incidents = [
  {
    title: 'Database latency spike',
    description: 'We are investigating elevated latencies.',
    time: '2025-07-16 10:20 AM',
  },
];

export default function StatusPage({ params }: { params: { org: string } }) {
  const org = params.org;
  const dispatch = useDispatch();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    dispatch(setLoading(false));

    const fetchServices = async () => {
      try {
        const res = await axios.get(
          `${Config.API_BASE_URL}/services?org=${org}`
        );
        setServices(res.data);
      } catch (err) {
        console.error('Failed to load services:', err);
      }
    };

    fetchServices();
  }, []);

  return (
    <main className='max-w-3xl mx-auto p-6 space-y-6'>
      <h1 className='text-2xl font-semibold'>Service Status</h1>

      <section className='space-y-3'>
        {services.map((svc) => (
          <ServiceCard
            key={svc.id}
            name={svc.name}
            status={statusCodeToString(svc.status_code, [])} // placeholder if you're not passing options
            bgClass={statusColorMap[svc.status_code] || 'bg-slate-700'}
          />
        ))}
      </section>

      <section>
        <h2 className='text-xl font-medium mb-2'>Active Incidents</h2>
        <IncidentTimeline incidents={incidents} />
      </section>
    </main>
  );
}
