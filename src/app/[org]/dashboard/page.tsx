'use client';

import { useEffect, useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/features/loading/loadingSlice';
import Config from '@/constants/config';
import axios from 'axios';
import { Button, Spin } from 'antd';
import { toast } from 'react-toastify';
import { getItem } from '@/lib/utils';
import { useStatusOptions } from '@/hooks/useStatusOptions';
import { useRouter, useParams } from 'next/navigation';
import { Service } from '@/types/service';

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const org = params?.org;
  const [services, setServices] = useState<Service[]>([]);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const { statusOptions, statusCodeToColor, statusCodeToString } = useStatusOptions();
  const dispatch = useDispatch();
  const [currentLoading, setCurrentLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchServices = useCallback(async () => {
    setCurrentLoading(true);
    try {
      const config = {
        url: `${Config.API_BASE_URL}/services?org=${org}`,
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getItem('token')}`,
        },
        data: {},
      };
      const res = await axios(config);
      setServices(res.data);
    } catch (error) {
      toast.error('Failed to fetch services');
    } finally {
      setCurrentLoading(false);
    }
  }, [org]);

  useEffect(() => {
    dispatch(setLoading(false));
    fetchServices();
  }, [dispatch, fetchServices]);

  const handleAddService = async () => {
    if (!name || !status) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      const config = {
        url: `${Config.API_BASE_URL}/services?org=${org}`,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getItem('token')}`,
        },
        data: { service_name: name, status_code: status },
      };
      setCurrentLoading(true);
      await axios(config);
      setName('');
      setStatus('');
      handleDialogChange(false);
      toast.success('Service added successfully');
      fetchServices();
    } catch (error) {
      toast.error('Failed to add service');
    } finally {
      setCurrentLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const config = {
        url: Config.API_BASE_URL + `/services/${id}/status`,
        method: 'patch',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getItem('token')}`,
        },
        data: { status_code: newStatus },
      };
      setCurrentLoading(true);
      await axios(config);
      fetchServices();
    } catch (error) {
      toast.error('Failed to update service status');
    } finally {
      setCurrentLoading(false);
    }
  };

  const handleDialogChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setName('');
      setStatus('');
    }
  };

  return (
    <Spin spinning={currentLoading}>
      <main className="max-w-4xl mx-auto p-6 space-y-6 min-h-screen">
        <div className="flex justify-between items-center ">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <div className="gap-4 flex">
            <Button type="primary" onClick={() => router.push(`/${org}/incidents`)}>
              Manage Incidents
            </Button>
            <Button type="primary" className="!text-white" onClick={() => setOpen(true)}>
              Add Service
            </Button>
          </div>
        </div>

        <Spin spinning={open && currentLoading}>
          <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogContent className="bg-[#212937] border-0">
              <DialogHeader>
                <DialogTitle className="text-center">Add New Service</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <Input
                  placeholder="Service Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white">
                    {statusOptions.map((option) => (
                      <SelectItem key={option.id} value={`${option.id}`}>
                        {option.status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button className="bg-green-600 text-white text-md" onClick={handleAddService}>
                  Submit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </Spin>

        <section className="grid gap-4">
          {services.length > 0 ? (
            services.map((svc) => (
              <Card key={svc.id} className="p-4 bg-[#212937] text-white border-0">
                <CardContent className="flex justify-between w-full items-center gap-4 p-0">
                  <div>
                    <p className="font-medium">{svc.service_name}</p>
                    <p className="text-sm text-gray-400">ID: {svc.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={String(svc.status_code)} // Assuming id is number, value should be string
                      onValueChange={(val) => handleStatusChange(svc.id, val)}
                    >
                      <SelectTrigger
                        className={`w-full border-0 text-md font-bold text-white flex justify-between items-center ${
                          statusCodeToColor(svc.status_code) || 'bg-slate-700'
                        }`}
                      >
                        <SelectValue
                          placeholder={statusCodeToString(svc.status_code) || 'Unknown'}
                        />
                      </SelectTrigger>

                      <SelectContent className="border-1 bg-[#212937] text-white p-2">
                        {statusOptions.map((option) => (
                          <SelectItem
                            key={option.id}
                            value={String(option.id)}
                            className="font-medium"
                          >
                            {option.status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              No services available at the moment. Please Start by adding a new Service.
            </p>
          )}
        </section>
      </main>
    </Spin>
  );
}
