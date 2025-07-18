// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/features/loading/loadingSlice';

export default function DashboardPage() {
  const [services, setServices] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('operational');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(false));
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const res = await api.get('/services');
    setServices(res.data);
  };

  const handleAddService = async () => {
    await api.post('/services', { name, status });
    setName('');
    setStatus('operational');
    fetchServices();
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    await api.patch(`/services/${id}`, { status: newStatus });
    fetchServices();
  };

  return (
    <main className='max-w-4xl mx-auto p-6 space-y-6 min-h-screen'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-semibold'>Admin Dashboard</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Service</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <Input
                placeholder='Service Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Status' />
                </SelectTrigger>
                <SelectContent className='bg-slate-800 text-white'>
                  <SelectItem value='operational'>Operational</SelectItem>
                  <SelectItem value='degraded'>Degraded</SelectItem>
                  <SelectItem value='outage'>Outage</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddService}>Submit</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <section className='grid gap-4'>
        {services.map((svc) => (
          <Card key={svc.id} className='p-4 '>
            <CardContent className='flex justify-between w-full items-center gap-4 p-0'>
              <div>
                <p className='font-medium'>{svc.name}</p>
                <p className='text-sm text-gray-400'>ID: {svc.id}</p>
              </div>
              <div className='flex items-center gap-2'>
                <Badge className='capitalize'>{svc.status}</Badge>
                <Select
                  value={svc.status}
                  onValueChange={(val) => handleStatusChange(svc.id, val)}
                >
                  <SelectTrigger className='w-[150px] bg-slate-800 border-slate-700'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='bg-slate-800 text-white'>
                    <SelectItem value='operational'>Operational</SelectItem>
                    <SelectItem value='degraded'>Degraded</SelectItem>
                    <SelectItem value='outage'>Outage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
