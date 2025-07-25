'use client';
import Config from '@/constants/config';
import { useParams, useRouter } from 'next/navigation';
import { setItem } from '@/lib/utils';
import { Modal, Form, Input, Button, Select, Spin } from 'antd';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setLoggedIn } from '@/features/loggedIn/loggedInSlice';
import api from '@/lib/api';
import { Organization } from '@/types/organization';

const { Option } = Select;

export default function AuthModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const [organizations, setOrganizations] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await api.get('/organizations');
        setOrganizations(response.data as Organization[]);
      } catch (err: any) {
        console.error('Failed to fetch organizations', err);
        toast.error(err.response?.data?.message || 'Failed to fetch organizations');
      }
    };

    fetchOrganizations();
  }, []);

  const [form] = Form.useForm();
  const params = useParams();
  const org = params?.org as string | undefined;

  const [currentLoading, setCurrentLoading] = useState(false);

  const handleLogin = async (values: any) => {
    setCurrentLoading(true);
    try {
      const config = {
        url: `${Config.API_BASE_URL}/auth/login?org=${org}`,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data: values,
      };
      const res = await axios(config);
      if (res.status === 200 && res.data.data.access_token) {
        onClose();
        toast.success('Login successful');
        setItem('token', res.data.data.access_token);
        dispatch(setLoggedIn(true));
      } else {
        toast.error('Login failed');
      }
    } catch (error) {
      console.error(error);
      toast.error(`Login error`);
    } finally {
      setCurrentLoading(false);
    }
  };

  const handleRegister = async (values: any) => {
    setCurrentLoading(true);
    try {
      const config = {
        url: `${Config.API_BASE_URL}/auth/register?org=${org}`,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data: values,
      };
      const res = await axios(config);
      if (res.status === 200) {
        toast.success('Registered successfully, you can login now');
        form.resetFields();
        const organization = organizations.find((org) => org.id === values.org_id);
        if (organization.slug) {
          setIsLogin(true);
          router.push(`/${organization.slug}/status`);
        } else {
          router.push('/');
        }
      } else {
        toast.error(' failed');
      }
    } catch (error) {
      console.error(error);
      toast.error(`Registration error`);
    } finally {
      setCurrentLoading(false);
    }
  };

  const toggleForm = () => {
    form.resetFields();
    setIsLogin(!isLogin);
  };

  return (
    <>
      <Modal
        open={visible}
        title={isLogin ? 'Login' : 'Register'}
        onCancel={onClose}
        footer={null}
        className="authModal"
      >
        {currentLoading && (
          <div className="fixed inset-0 bg-[rgba(255,255,255,0.2)] z-50 flex items-center justify-center">
            <Spin size="large" />
          </div>
        )}
        <Form form={form} layout="vertical" onFinish={isLogin ? handleLogin : handleRegister}>
          {!isLogin && (
            <>
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please enter your username' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Email" name="email">
                <Input type="email" placeholder="Optional" />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please enter your password' }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Organization"
                name="org_id"
                rules={[{ required: true, message: 'Please select an organization' }]}
              >
                <Select
                  placeholder="Select an organization"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    typeof option?.label === 'string' &&
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {organizations.map((org) => (
                    <Option key={org.id} value={org.id}>
                      {org.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: 'Please select a role' }]}
              >
                <Select placeholder="Select a role">
                  <Option value="admin">Admin</Option>
                  <Option value="viewer">Viewer</Option>
                </Select>
              </Form.Item>
            </>
          )}
          {isLogin && (
            <>
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please enter your username' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please enter your password' }]}
              >
                <Input.Password />
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {isLogin ? 'Login' : 'Register'}
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-2">
          <Button type="link" onClick={toggleForm}>
            {isLogin ? 'New user? Register' : 'Already registered? Login'}
          </Button>
        </div>
      </Modal>
    </>
  );
}
