export type Service = {
  id: number;
  service_name: string;
  status_code: number;
  status: string;
  uptime?: string;
};

export type Service_card = {
  service_name: string;
  status: string;
  uptime?: string;
  bgClass?: string;
};

export type SortKey = 'service_name' | 'status_code' | 'status';
