import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Service_card } from '@/types/service';

export default function ServiceCard({ service_name, status, uptime, bgClass }: Service_card) {
  return (
    <Card className="w-full bg-[#212937] text-white border-0">
      <CardContent className="flex justify-between items-center px-4">
        <div>
          <div className="text-lg font-medium">{service_name}</div>
          {uptime && <div className="text-sm text-gray-400 mb-2">uptime 90d - {uptime}</div>}
        </div>
        <Badge className={`p-2 ${bgClass} text-md`}>{status}</Badge>
      </CardContent>
    </Card>
  );
}
