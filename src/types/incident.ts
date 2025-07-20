export type IncidentUpdate = {
  id: number;
  description: string;
  created_at: string;
};

export type Incident = {
  id: number;
  title: string;
  status: string;
  description: string | null;
  started_at: string;
  services: { service_name: string }[];
  updates: IncidentUpdate[];
};

export type IncidentCardProps = {
  incident: Incident;
  onUpdate?: (incident: Incident) => void;
  userRole: string;
};
