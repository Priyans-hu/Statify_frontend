'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/features/loading/loadingSlice';

import { useParams } from 'next/navigation';
import Config from '@/constants/config';
import { useStatusOptions } from '@/hooks/useStatusOptions';

import ServiceCard from '@/components/serviceCard';
import IncidentTimeline from '@/components/IndicatorTimeline';

type Service = {
  id: number;
  service_name: string;
  status_code: number;
  status: string;
};

export default function StatusPage() {
  const params = useParams();
  const org = params.org;
  const dispatch = useDispatch();
  const [services, setServices] = useState<Service[]>([]);
  const { statusCodeToColor, statusCodeToString } = useStatusOptions();
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    dispatch(setLoading(false));

    const fetchServices = async () => {
      try {
        const res = await axios.get(`${Config.API_BASE_URL}/services?org=${org}`);
        setServices(res.data);
      } catch (err) {
        console.error('Failed to load services:', err);
      }
    };

    const fetchIncidents = async () => {
      try {
        const res = await axios.get(`${Config.API_BASE_URL}/incidents/active?org=${org}`);
        setIncidents(res?.data?.incidents || []);
      } catch (err) {
        console.error('Failed to load incidents:', err);
      }
    };

    fetchServices();
    fetchIncidents();
  }, []);

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Service Status</h1>

      <section className="space-y-3">
        {services.map((svc) => (
          <ServiceCard
            key={svc.id}
            name={svc.service_name}
            status={statusCodeToString(svc.status_code)}
            bgClass={statusCodeToColor(svc.status_code) || 'bg-slate-700'}
          />
        ))}
      </section>

      <section>
        <h2 className="text-xl font-medium mb-2">Active Incidents</h2>
        {incidents.length > 0 ? (
          <IncidentTimeline incidents={incidents} />
        ) : (
          <p className="text-gray-500">No active incidents found.</p>
        )}
      </section>
    </main>
  );
}
