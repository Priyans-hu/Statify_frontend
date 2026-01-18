'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Modal, Input, Select, message } from 'antd';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import Config from '@/constants/config';
import IncidentCard from '@/components/incidentCard';
import { getLoggedInUser } from '@/lib/utils';

const { TextArea } = Input;
const { Option } = Select;

import { Incident } from '@/types/incident';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/features/loading/loadingSlice';

export default function IncidentsPage() {
  const { org } = useParams();
  const router = useRouter();
  const user = getLoggedInUser();
  const dispatch = useDispatch();
  const userRole = user?.role || 'viewer';

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [updateText, setUpdateText] = useState('');
  const [newStatus, setNewStatus] = useState<string>('');
  const [resolved, setResolved] = useState(false);

  const fetchIncidents = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const res = await api.get(`${Config.API_BASE_URL}/incidents/active`, {
        params: { org },
      });
      setIncidents(res.data.incidents);
    } catch (err) {
      // Error handled silently - incidents will show empty state
    } finally {
      dispatch(setLoading(false));
    }
  }, [org]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const handleUpdate = (incident: Incident) => {
    setSelectedIncident(incident);
    setNewStatus(incident.status);
    setUpdateText('');
    setModalVisible(true);
  };

  const submitUpdate = async () => {
    if (!selectedIncident) return;

    try {
      await api.patch(`${Config.API_BASE_URL}/incidents/${selectedIncident.id}`, {
        incident_id: selectedIncident.id,
        status: newStatus,
        description: updateText || undefined,
        resolved_at: resolved ? Date.now() : undefined,
      });

      message.success('Incident updated');
      setModalVisible(false);
      fetchIncidents();
    } catch (err) {
      message.error('Failed to update incident');
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6 min-h-screen">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Active Incidents</h1>
          <Button type="primary" onClick={() => router.push(`/${org}/incidents/new`)}>
            Add New Incident
          </Button>
        </div>

        {incidents.length === 0 ? (
          <p className="text-gray-500">No active incidents found.</p>
        ) : (
          <div className="grid gap-4">
            {incidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                userRole={userRole}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        title="Update Incident"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={submitUpdate}
        okText="Submit"
        className="bg-[#131a26] text-white"
      >
        <div className="space-y-4">
          <label className="block text-sm text-gray-300">Change Status</label>
          <Select value={newStatus} onChange={(value) => setNewStatus(value)} className="w-full">
            {['investigating', 'identified', 'monitoring', 'resolved'].map((status) => (
              <Option key={status} value={status}>
                {status}
              </Option>
            ))}
          </Select>
          <label className="block text-sm text-gray-300 mt-4">Add Update (Optional)</label>
          <TextArea
            rows={3}
            value={updateText}
            onChange={(e) => setUpdateText(e.target.value)}
            placeholder="Describe what changed or current situation..."
          />
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox
              id="resolve-incident"
              checked={resolved}
              onCheckedChange={(checked) => {
                if (checked !== 'indeterminate') {
                  setResolved(checked);
                }
              }}
            />
            <Label htmlFor="resolve-incident" className="text-white">
              Resolve Incident
            </Label>
          </div>
        </div>
      </Modal>
    </main>
  );
}
