'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/features/loading/loadingSlice';

import { useParams, useRouter } from 'next/navigation';
import Config from '@/constants/config';
import { useStatusOptions } from '@/hooks/useStatusOptions';

import ServiceCard from '@/components/serviceCard';
import IncidentTimeline from '@/components/IndicatorTimeline';

import { connectWebSocket } from '@/lib/websocket';
import SortServices from '@/components/sortServices';
import { Service } from '@/types/service';

export default function StatusPage() {
  const params = useParams();
  const router = useRouter();
  const org = params.org;
  const dispatch = useDispatch();
  const [services, setServices] = useState<Service[]>([]);
  const [sortedServices, setSortedServices] = useState<Service[]>(services);
  const { statusCodeToColor, statusCodeToString } = useStatusOptions();
  const [incidents, setIncidents] = useState<any[]>([]);
  const [uptimeMetrics, setUptimeMetrics] = useState<any[]>([]);

  const fetchServices = useCallback(async () => {
    try {
      const res = await axios.get(`${Config.API_BASE_URL}/services?org=${org}`);
      setServices(res.data);
      return res.data;
    } catch (err) {
      console.error('Failed to load services:', err);
    }
  }, [org]);

  const fetchIncidents = useCallback(async () => {
    try {
      const res = await axios.get(`${Config.API_BASE_URL}/incidents/active?org=${org}`);
      setIncidents(res?.data?.incidents || []);
    } catch (err) {
      console.error('Failed to load incidents:', err);
    }
  }, [org]);

  const fetchUptimeMetrics = useCallback(async () => {
    try {
      const res = await axios.get(`${Config.API_BASE_URL}/metrics/?org=${org}`);
      const metrics = res.data.services_uptime;
      sessionStorage.setItem(`uptimeMetrics-${org}`, JSON.stringify(metrics));
      setUptimeMetrics(metrics);
    } catch (err) {
      console.error('Failed to load incidents:', err);
    }
  }, [org]);

  const mergeServicesWithUptime = (services: Service[], uptimeMetrics: any): Service[] => {
    const uptimeMap = new Map<number, { uptime: number; status: string }>();

    if (!services?.length || !uptimeMetrics?.length) {
      console.warn('Missing services or uptime metrics');
      return services;
    }

    for (const uptimeSvc of uptimeMetrics) {
      uptimeMap.set(uptimeSvc.id, {
        uptime: uptimeSvc.uptime,
        status: uptimeSvc.status,
      });
    }

    return services.map((service) => {
      console.log('computing');
      const match = uptimeMap.get(Number(service.id));

      const status = match?.status ?? service.status ?? 'Unknown';
      const uptime = match?.uptime != null ? `${match.uptime.toFixed(2)}%` : undefined;

      return {
        ...service,
        status,
        uptime,
      };
    });
  };

  useEffect(() => {
    const initialize = async () => {
      dispatch(setLoading(true));
      try {
        connectWebSocket(org, handleIncomingMessage);
        await fetchServices(); // get services
        await fetchIncidents(); // get active incidents
        await fetchUptimeMetrics(); // get metrics for service
      } catch (err) {
        console.error('Initialization failed:', err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    initialize();
  }, [fetchIncidents, fetchServices, fetchUptimeMetrics, dispatch, org]);

  useEffect(() => {
    // map uptime with service to service id
    const serviceWithUptime = mergeServicesWithUptime(services, uptimeMetrics);
    if (serviceWithUptime.length > 0) setServices(serviceWithUptime);
  }, [uptimeMetrics]);

  const handleIncomingMessage = (recievedData: { data: any; type: any }) => {
    if (recievedData && recievedData.data && recievedData.type) {
      const data = recievedData.data;
      const objectType = recievedData.type as 'service' | 'incident';
      const updateData = data[objectType];

      const funcCall = {
        service: setServices,
        incident: setIncidents,
      };

      if (updateData) {
        funcCall[objectType]((prev: any[]) => {
          const index = prev.findIndex((svc) => svc.id == updateData.id);
          if (index !== -1) {
            return prev.map((svc) => (svc.id == updateData.id ? { ...svc, ...updateData } : svc));
          } else {
            return [...prev, updateData];
          }
        });
      }
    }
  };

  return (
    <main className="max-w-3xl mx-auto min-h-screen p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Service Status</h1>
        <SortServices services={services} onSorted={setSortedServices} />
      </div>

      <section className="space-y-3">
        {services.length > 0 ? (
          <>
            {sortedServices.map((svc) => (
              <ServiceCard
                key={svc.id}
                service_name={svc.service_name}
                status={statusCodeToString(svc.status_code)}
                uptime={svc.uptime}
                bgClass={statusCodeToColor(svc.status_code) || 'bg-slate-700'}
              />
            ))}
          </>
        ) : (
          <p className="text-gray-500">No services available at the moment.</p>
        )}
      </section>

      <section>
        <div className="flex justify-between items-center ">
          <h2 className="text-xl font-medium mb-2">Active Incidents</h2>
          <h2
            onClick={() => router.push(`/${org}/incidents/all`)}
            className="text-xl font-medium mb-2 underline cursor-pointer"
          >
            View all past incidents
          </h2>
        </div>
        {incidents.length > 0 ? (
          <IncidentTimeline incidents={incidents} />
        ) : (
          <p className="text-gray-500">No active incidents found.</p>
        )}
      </section>
    </main>
  );
}
