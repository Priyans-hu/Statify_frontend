'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Config from '@/constants/config';
import IncidentCard from '@/components/incidentCard';
import { getLoggedInUser } from '@/lib/utils';

import { Incident } from '@/types/incident';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/features/loading/loadingSlice';

export default function IncidentsPage() {
  const { org } = useParams();
  const user = getLoggedInUser();
  const router = useRouter();
  const dispatch = useDispatch();
  const userRole = user?.role || 'viewer';

  const [incidents, setIncidents] = useState<Incident[]>([]);

  const fetchIncidents = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const res = await api.get(`${Config.API_BASE_URL}/incidents/`, {
        params: { org },
      });
      setIncidents(res.data.incidents);
    } catch (err) {
      console.error('Failed to fetch incidents:', err);
    } finally {
      dispatch(setLoading(false));
    }
  }, [org]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6 min-h-screen">
      <div className="px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">All Incidents</h1>
          {user?.role === 'admin' && user.org_slug === org && (
            <h2
              onClick={() => router.push(`/${org}/incidents/`)}
              className="text-xl font-medium mb-2 underline cursor-pointer"
            >
              Manage Active Incidents
            </h2>
          )}
        </div>

        {incidents.length === 0 ? (
          <p className="text-gray-500">No incidents history.</p>
        ) : (
          <div className="grid gap-4">
            {incidents.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} userRole={userRole} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
