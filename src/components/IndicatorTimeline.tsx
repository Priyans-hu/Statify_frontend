'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Modal, Timeline } from 'antd';
import dayjs from 'dayjs';

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
  services: any[];
  updates: IncidentUpdate[];
};

type Props = {
  incidents: Incident[];
};

export default function IncidentTimeline({ incidents }: Props) {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (incident: Incident) => {
    setSelectedIncident(incident);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedIncident(null);
  };

  return (
    <>
      <div className="space-y-4">
        {incidents.map((incident) => (
          <Card
            key={incident.id}
            onClick={() => openModal(incident)}
            className="cursor-pointer hover:shadow-md transition bg-[#212937] text-white border-0"
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{incident.title}</h4>
                  <p className="text-sm text-gray-600">
                    {incident.description || 'No description provided.'}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg capitalize">{incident.status}</h3>
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-2 flex justify-between">
                <span>Started at: {dayjs(incident.started_at).format('MMM D, YYYY h:mm A')}</span>
                <span>Affected services: {incident.services.length}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal title={selectedIncident?.title} open={isModalOpen} onCancel={closeModal} footer={null}>
        {selectedIncident?.updates.length ? (
          <Timeline>
            {selectedIncident.updates.map((update) => (
              <Timeline.Item key={update.id}>
                <p className="font-medium">
                  {dayjs(update.created_at).format('MMM D, YYYY h:mm A')}
                </p>
                <p>{update.description}</p>
              </Timeline.Item>
            ))}
          </Timeline>
        ) : (
          <p>No updates yet.</p>
        )}
      </Modal>
    </>
  );
}
