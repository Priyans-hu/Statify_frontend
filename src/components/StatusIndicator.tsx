type Props = {
  status: 'operational' | 'degraded' | 'outage';
};

const statusColor = {
  operational: 'bg-green-500',
  degraded: 'bg-yellow-400',
  outage: 'bg-red-500',
};

export default function StatusIndicator({ status }: Props) {
  return (
    <div className='flex items-center gap-2'>
      <span className={`w-3 h-3 rounded-full ${statusColor[status]}`} />
      <span className='capitalize text-sm text-gray-600'>{status}</span>
    </div>
  );
}
