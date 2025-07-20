'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Modal, Timeline } from 'antd';
import dayjs from 'dayjs';
import ServiceCard from './serviceCard';
import { useStatusOptions } from '@/hooks/useStatusOptions';

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
  const { statusCodeToColor, statusCodeToString } = useStatusOptions();

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
              <div className="flex justify-between items-center font-semibold text-lg capitalize">
                <h4 className="text-md">{incident.title}</h4>
                <h4>{incident.status}</h4>
              </div>
              <p className="w-9/12 text-sm text-gray-600">
                {incident.description || 'No description provided.'}
              </p>
              <div className="text-xs text-gray-400 mt-2 flex justify-between">
                <span>Started at: {dayjs(incident.started_at).format('MMM D, YYYY h:mm A')}</span>
                <span>Affected services: {incident.services.length}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal title={selectedIncident?.title} open={isModalOpen} onCancel={closeModal} footer={null}>
        <p className="text-sm text-gray-400 mb-2 w-11/12 text-center m-auto">
          {selectedIncident?.description}
        </p>
        <div>
          {selectedIncident?.services.length ? (
            <div className="space-y-2 my-4">
              <div className="font-semibold text-xl">Affected Services:</div>
              {selectedIncident.services.map((svc) => (
                <ServiceCard
                  key={svc.id}
                  name={svc.service_name}
                  status={statusCodeToString(svc.status_code)}
                  bgClass={statusCodeToColor(svc.status_code) || 'bg-slate-700'}
                />
              ))}
            </div>
          ) : (
            <p>No services affected.</p>
          )}

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
            <div className="space-y-2 my-4">
              <div className="font-semibold text-xl">Incident Updates:</div>
              <p>No updates available.</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
