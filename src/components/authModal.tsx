'use client';
import Config from '@/constants/config';
import { setLoading } from '@/features/loading/loadingSlice';
import { useParams } from 'next/navigation';
import { setItem } from '@/lib/utils';
import { Modal, Form, Input, Button, Select, Spin } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const { Option } = Select;

export default function AuthModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const params = useParams();
  const org = params?.org as string | undefined;

  const [currentLoading, setCurrentLoading] = useState(false);

  const handleLogin = async (values: any) => {
    console.log('Logging in with', values);
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
        dispatch(setLoading(true));
        window.location.reload();
      } else {
        toast.error('Login failed');
      }
    } catch (error) {
      toast.error('Login error:');
    } finally {
      setCurrentLoading(false);
    }
  };

  const handleRegister = async (values: any) => {
    console.log('Registering with', values);
    // dispatch register action
    setCurrentLoading(true);
    try {
      const config = {
        url: Config.API_BASE_URL + '/auth/register',
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data: values,
      };
      const res = await axios(config);
      if (res.status === 200) {
        toast.success('Registered successfully, you can login now');
        setIsLogin(true);
        form.resetFields();
      } else {
        toast.error('Registration failed');
      }
    } catch (error) {
      toast.error('Registration error');
    } finally {
      setCurrentLoading(false);
    }
  };

  const toggleForm = () => {
    form.resetFields();
    setIsLogin(!isLogin);
  };

  return (
    <Spin spinning={currentLoading}>
      <Modal
        open={visible}
        title={isLogin ? 'Login' : 'Register'}
        onCancel={onClose}
        footer={null}
        className="authModal"
      >
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
                label="Organisation ID"
                name="org_id"
                rules={[{ required: true, message: 'Please enter organisation ID' }]}
              >
                <Input />
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
    </Spin>
  );
}
