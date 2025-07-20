'use client';

import IncidentCard from '@/components/incidentCard';
import { Incident } from '@/types/incident';
import { getLoggedInUser } from '@/lib/utils';

type Props = {
  incidents: Incident[];
};

export default function IncidentTimeline({ incidents }: Props) {
  const user = getLoggedInUser();
  const userRole = user?.role || 'viewer';

  return (
    <>
      <div className="space-y-4">
        {incidents.map((incident) => (
          <IncidentCard key={incident.id} incident={incident} userRole={userRole} />
        ))}
      </div>
    </>
  );
}
