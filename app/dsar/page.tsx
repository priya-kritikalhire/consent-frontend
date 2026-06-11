'use client';
import { useEffect, useState } from 'react';
import AppShell from '../../components/AppShell';
import StatusBadge from '../../components/StatusBadge';
import { apiFetch, getUser } from '../../lib/api';
import { ui } from '../../lib/styles';

export default function DsarListPage() {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState('');
  const user = getUser();
  useEffect(() => { apiFetch('/dsar').then(setItems).catch(e => setError(e.message)); }, []);
  async function setStatus(id: string, status: string) {
    await apiFetch(`/dsar/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
    setItems(await apiFetch('/dsar'));
  }
  return (
    <AppShell title="DSAR Requests" subtitle={user?.role === 'DATA_PRINCIPAL' ? 'Your own DSAR requests' : 'Admin queue for all DSAR requests'}>
      <div className={ui.card}>
        {error && <div className={`${ui.error} mb-4`}>{error}</div>}
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>{['Request ID', 'Name', 'Email', 'Type', 'Status', 'Created', 'Source', 'Action'].map((header) => <th className={ui.th} key={header}>{header}</th>)}</tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr className={ui.tr} key={item._id}>
                  <td className={ui.td}>{item.requestId}</td>
                  <td className={ui.td}>{item.fullName}</td>
                  <td className={ui.td}>{item.email}</td>
                  <td className={ui.td}>{item.requestTypes?.join(', ')}</td>
                  <td className={ui.td}><StatusBadge value={item.status} /></td>
                  <td className={ui.td}>{item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</td>
                  <td className={ui.td}>{item.sourceCollection || 'portal'}</td>
                  <td className={ui.td}>{user?.role !== 'DATA_PRINCIPAL' && <select className={ui.select} value={item.status} onChange={e => setStatus(item._id, e.target.value)}><option>Pending</option><option>In Progress</option><option>Waiting for User</option><option>Completed</option><option>Rejected</option><option>Canceled</option></select>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
