'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

import { Service } from '@/types/service';

type SortKey = 'service_name' | 'status_code' | 'status';

interface SortServicesProps {
  services: Service[];
  onSorted: (sortedServices: Service[]) => void;
}

export function sortServicesArray(
  services: Service[],
  key: SortKey,
  ascending: boolean
): Service[] {
  return [...services].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];

    if (valA < valB) return ascending ? -1 : 1;
    if (valA > valB) return ascending ? 1 : -1;
    return 0;
  });
}

export default function SortServices({ services, onSorted }: SortServicesProps) {
  const [sortKey, setSortKey] = React.useState<SortKey>('service_name');
  const [ascending, setAscending] = React.useState(true);

  React.useEffect(() => {
    const sorted = sortServicesArray(services, sortKey, ascending);
    onSorted(sorted);
  }, [services, sortKey, ascending, onSorted]);

  const toggleSortOrder = () => setAscending(!ascending);

  const handleSelect = (key: SortKey) => {
    if (key === sortKey) {
      toggleSortOrder();
    } else {
      setSortKey(key);
      setAscending(true);
    }
  };

  const labelMap: Record<SortKey, string> = {
    service_name: 'Service Name',
    status_code: 'Status Code',
    status: 'Status',
  };

  return (
    <div className="inline-flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="bg-[#212937] text-white border-0">
            Sort by: {labelMap[sortKey]} {ascending ? '▲' : '▼'}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="bg-[#212937] text-white border-none shadow-lg"
        >
          <DropdownMenuLabel className="text-white"></DropdownMenuLabel>
          {(['service_name', 'status_code', 'status'] as SortKey[]).map((key) => (
            <DropdownMenuItem
              key={key}
              onSelect={() => handleSelect(key)}
              className={`text-white hover:bg-[#2b3648] ${key === sortKey ? 'font-semibold' : ''}`}
            >
              {labelMap[key]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
