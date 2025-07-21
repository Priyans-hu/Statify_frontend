export type IncidentUpdate = {
  id: number;
  description: string;
  created_at: string;
  timestamp: string;
  resolved_at?: string; // ISO date string
};

export type Incident = {
  id: number;
  title: string;
  status: string;
  description: string | null;
  started_at: string;
  resolved_at?: string;
  services: { service_name: string }[];
  updates: IncidentUpdate[];
};

export type IncidentCardProps = {
  incident: Incident;
  onUpdate?: (incident: Incident) => void;
  userRole: string;
};
