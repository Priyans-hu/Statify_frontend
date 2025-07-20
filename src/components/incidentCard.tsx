'use client';

import { Modal, Timeline } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import ServiceCard from './serviceCard';
import { usePathname } from 'next/navigation';
import { useStatusOptions } from '@/hooks/useStatusOptions';

import { useState } from 'react';
import { Button, Tag } from 'antd';
import { Card, CardContent } from '@/components/ui/card';
import { IncidentCardProps, Incident } from '@/types/incident';
import { Service } from '@/types/service';

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

dayjs.extend(utc);

export default function IncidentCard({ incident, onUpdate, userRole }: IncidentCardProps) {
  const pathname = usePathname();
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
      <Card
        className="bg-[#212937] text-white border-0 cursor-pointer"
        onClick={() => openModal?.(incident)}
      >
        <CardContent>
          <div className="flex justify-between items-center my-2">
            <span className="text-lg font-semibold">{incident.title}</span>
            <Tag className="capitalize" color={getStatusColor(incident.status)}>
              {incident.status}
            </Tag>
          </div>

          <p className="text-sm text-gray-400 mb-2">{incident.description}</p>
          <p className="text-sm text-gray-500 mb-2">
            Started at: {new Date(incident.started_at).toLocaleString()}
          </p>

          <div className="mb-2">
            <strong>Services Affected:</strong>{' '}
            {incident.services.map((s) => s.service_name).join(', ') || 'None'}
          </div>

          {incident.updates.length > 0 && (
            <div className="mt-2">
              <strong>Updates:</strong>
              <ul className="list-disc ml-6">
                {incident.updates.map((update) => (
                  <li key={update.id}>
                    <span className="text-sm text-gray-400">
                      {dayjs(update.timestamp).format('MMM D, YYYY h:mm A')} - {update.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {userRole === 'admin' &&
            (pathname?.endsWith('/dashboard') || pathname?.endsWith('/incidents')) &&
            onUpdate && (
              <div className="mt-4 flex gap-4">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdate(incident);
                  }}
                  type="default"
                >
                  Update / Resolve
                </Button>
              </div>
            )}
        </CardContent>
      </Card>

      <Modal title={selectedIncident?.title} open={isModalOpen} onCancel={closeModal} footer={null}>
        <p className="text-sm text-gray-400 mb-2 w-11/12 text-center m-auto">
          {selectedIncident?.description}
        </p>
        <div>
          {selectedIncident?.services.length ? (
            <div className="space-y-2 my-4">
              <div className="font-semibold text-xl">Affected Services:</div>
              {selectedIncident.services.map((svc) => {
                const service = svc as Service;
                return (
                  <ServiceCard
                    key={service.id}
                    name={service.service_name}
                    status={statusCodeToString(service.status_code)}
                    bgClass={statusCodeToColor(service.status_code) || 'bg-slate-700'}
                  />
                );
              })}
            </div>
          ) : (
            <p>No services affected.</p>
          )}

          {selectedIncident?.updates.length ? (
            <Timeline
              className="my-3"
              items={selectedIncident.updates.map((update) => ({
                key: update.id,
                children: (
                  <>
                    <div className="text-white">
                      <p className="font-medium">
                        {dayjs(update.timestamp).format('MMM D, YYYY h:mm A')}
                      </p>
                      <p>{update.description}</p>
                    </div>
                  </>
                ),
              }))}
            />
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
