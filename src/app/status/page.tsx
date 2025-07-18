"use client";
import ServiceCard from '@/components/serviceCard';
import IncidentTimeline from '@/components/IndicatorTimeline';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/features/loading/loadingSlice';

type ServiceStatus = 'operational' | 'degraded' | 'outage';

const services: { name: string; status: ServiceStatus }[] = [
  { name: 'API Gateway', status: 'operational' },
  { name: 'Database', status: 'degraded' },
];

const incidents = [
  {
    title: 'Database latency spike',
    description: 'We are investigating elevated latencies.',
    time: '2025-07-16 10:20 AM',
  },
];

export default function StatusPage() {
  const dispatch = useDispatch();
  useEffect(() => {
        dispatch(setLoading(false));
  }, []);
  return (
    <main className='max-w-3xl mx-auto p-6 space-y-6'>
      <h1 className='text-2xl font-semibold'>Service Status</h1>
      <section className='space-y-3'>
        {services.map((svc, idx) => (
          <ServiceCard key={idx} {...svc} />
        ))}
      </section>

      <section>
        <h2 className='text-xl font-medium mb-2'>Active Incidents</h2>
        <IncidentTimeline incidents={incidents} />
      </section>
    </main>
  );
}
