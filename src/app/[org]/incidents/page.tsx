// app/[org]/incidents/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Card, Tag } from 'antd';
import axios from 'axios';
import Config from '@/constants/config';

type IncidentUpdate = {
  id: number;
  description: string;
  created_at: string;
};

type Incident = {
  id: number;
  title: string;
  status: string;
  description: string | null;
  started_at: string;
  services: { name: string }[];
  updates: IncidentUpdate[];
};

export default function IncidentsPage() {
  const { org } = useParams();
  const router = useRouter();
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const fetchIncidents = async () => {
    try {
      const res = await axios.get(`${Config.API_BASE_URL}/incidents/active`, {
        params: { org },
      });
      setIncidents(res.data.incidents);
    } catch (err) {
      console.error('Failed to fetch incidents:', err);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'investigating':
        return 'orange';
      case 'identified':
        return 'red';
      case 'monitoring':
        return 'blue';
      case 'resolved':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6 min-h-screen">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Active Incidents</h1>
          <Button type="primary" onClick={() => router.push(`/${org}/incidents/new`)}>
            Add New Incident
          </Button>
        </div>

        {incidents.length === 0 ? (
          <p className="text-gray-500">No active incidents found.</p>
        ) : (
          <div className="grid gap-4">
            {incidents.map((incident) => (
              <Card
                key={incident.id}
                title={
                  <div className="flex justify-between items-center">
                    <span>{incident.title}</span>
                    <Tag color={getStatusColor(incident.status)}>{incident.status}</Tag>
                  </div>
                }
              >
                <p className="text-sm text-gray-600 mb-2">{incident.description}</p>
                <p className="text-sm text-gray-500 mb-2">
                  Started at: {new Date(incident.started_at).toLocaleString()}
                </p>

                <div className="mb-2">
                  <strong>Services Affected:</strong>{' '}
                  {incident.services.map((s) => s.name).join(', ') || 'None'}
                </div>

                {incident.updates.length > 0 && (
                  <div className="mt-2">
                    <strong>Updates:</strong>
                    <ul className="list-disc ml-6">
                      {incident.updates.map((update) => (
                        <li key={update.id}>
                          <span className="text-sm text-gray-700">
                            {new Date(update.created_at).toLocaleString()} - {update.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
