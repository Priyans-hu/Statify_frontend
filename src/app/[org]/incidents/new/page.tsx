'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Form, Input, Select, DatePicker, message } from 'antd';
import axios from 'axios';
import Config from '@/constants/config';
import dayjs from 'dayjs';

const { TextArea } = Input;

export default function NewIncidentPage() {
  const { org } = useParams();
  const router = useRouter();
  const [services, setServices] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    axios
      .get(`${Config.API_BASE_URL}/services`, { params: { org } })
      .then((res) => setServices(res.data))
      .catch((err) => {
        console.error('Failed to load services', err);
        message.error('Could not load services');
      });
  }, []);

  const handleSubmit = async (values: any) => {
    const payload = {
      title: values.title,
      status: values.status,
      description: values.description || null,
      started_at: values.started_at
        ? dayjs(values.started_at).toISOString()
        : new Date().toISOString(),
      service_ids: values.services,
    };

    try {
      setLoading(true);
      await axios.post(`${Config.API_BASE_URL}/incidents?org=${org}`, payload);
      message.success('Incident created successfully');
      router.push(`/${org}/incidents`);
    } catch (err) {
      console.error(err);
      message.error('Failed to create incident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-6">Create New Incident</h1>

      <Form layout="vertical" form={form} onFinish={handleSubmit} disabled={loading}>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please enter a title' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Select current incident status' }]}
        >
          <Select placeholder="Select a status">
            <Select.Option value="investigating">Investigating</Select.Option>
            <Select.Option value="identified">Identified</Select.Option>
            <Select.Option value="monitoring">Monitoring</Select.Option>
            <Select.Option value="resolved">Resolved</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Description" name="description">
          <TextArea rows={4} placeholder="Describe the incident" />
        </Form.Item>

        <Form.Item label="Start Time" name="started_at">
          <DatePicker showTime className="w-full" placeholder="Leave empty to use current time" />
        </Form.Item>

        <Form.Item
          label="Affected Services"
          name="services"
          rules={[{ required: true, message: 'Select affected services' }]}
        >
          <Select
            mode="multiple"
            placeholder="Select services"
            options={services.map((s) => ({
              label: s.name,
              value: s.id,
            }))}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Incident
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
