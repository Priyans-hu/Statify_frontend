'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Config from '@/constants/config';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

import api from '@/lib/api';

export default function NewIncidentPage() {
  const { org } = useParams();
  const router = useRouter();

  const [services, setServices] = useState<{ id: number; service_name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    started_at: null as Date | null,
    services: [] as number[],
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${Config.API_BASE_URL}/services?org=${org}`);
        setServices(res.data);
      } catch (err) {
        console.error('Failed to load services:', err);
      }
    };

    fetchServices();
  }, [org]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      title: formData.title,
      description: formData.description || null,
      status: formData.status,
      started_at: formData.started_at
        ? dayjs(formData.started_at).toISOString()
        : new Date().toISOString(),
      service_ids: formData.services,
    };

    try {
      setLoading(true);
      await api.post(`${Config.API_BASE_URL}/incidents?org=${org}`, payload);
      alert('Incident created successfully');
      router.push(`/${org}/incidents`);
    } catch (err) {
      console.error(err);
      alert('Failed to create incident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-white">
      <h1 className="text-xl font-bold mb-6">Create New Incident</h1>

      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Incident title"
          />
        </div>

        <div>
          <Label>Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="identified">Identified</SelectItem>
              <SelectItem value="monitoring">Monitoring</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe the incident"
            rows={4}
          />
        </div>

        <div>
          <Label>Start Time</Label>
          <DatePicker
            selected={formData.started_at}
            onChange={(date) => handleChange('started_at', date)}
            showTimeSelect
            dateFormat="Pp"
            placeholderText="Leave empty to use current time"
            className="w-full bg-transparent text-white border border-gray-300 px-3 py-2 rounded-md"
          />
        </div>

        <div>
          <Label>Affected Services</Label>
          <div className="rounded-md py-3 space-y-2 max-h-64 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {services.map((service) => {
                const isChecked = formData.services.includes(service.id);
                return (
                  <label
                    key={service.id}
                    className="flex items-center space-x-2 text-white cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={service.id}
                      checked={isChecked}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (e.target.checked) {
                          handleChange('services', [...formData.services, value]);
                        } else {
                          handleChange(
                            'services',
                            formData.services.filter((id) => id !== value)
                          );
                        }
                      }}
                      className="accent-blue-600 w-4 h-4"
                    />
                    <span>{service.service_name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          {loading ? 'Creating...' : 'Create Incident'}
        </Button>
      </div>
    </div>
  );
}
