import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStatusOptions } from '@/hooks/useStatusOptions';

type Props = {
  name: string;
  status: string; // 'operational', 'degraded', etc
};

export default function ServiceCard({ name, status }: Props) {
  const { statusLabelToColor } = useStatusOptions();

  return (
    <Card className="w-full bg-[#212937] text-white border-0">
      <CardContent className="flex justify-between items-center px-4">
        <div className="text-lg font-medium">{name}</div>
        <Badge className={`p-2 ${statusLabelToColor(status)} text-md`}>{status}</Badge>
      </CardContent>
    </Card>
  );
}
