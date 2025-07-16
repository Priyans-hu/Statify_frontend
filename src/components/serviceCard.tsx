import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Props = {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
};

const statusColor = {
  operational: 'bg-green-500',
  degraded: 'bg-yellow-500',
  outage: 'bg-red-500',
};

export default function ServiceCard({ name, status }: Props) {
  return (
    <Card className='w-full'>
      <CardContent className='flex justify-between items-center p-4'>
        <div className='text-lg font-medium'>{name}</div>
        <Badge className={statusColor[status]}>{status}</Badge>
      </CardContent>
    </Card>
  );
}
