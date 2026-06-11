'use client';
import { useEffect, useState } from 'react';
import AppShell from '../../components/AppShell';
import StatusBadge from '../../components/StatusBadge';
import { apiFetch, getUser } from '../../lib/api';
import { ui } from '../../lib/styles';

export default function ConsentsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState('');
  const user = getUser();
  useEffect(() => { apiFetch('/portal/consents').then(setItems).catch(e => setError(e.message)); }, []);
  async function withdraw(id: string) {
    const reason = prompt('Reason for withdrawal?') || '';
    await apiFetch(`/portal/consents/${id}/withdraw`, { method: 'POST', body: JSON.stringify({ reason }) });
    setItems(await apiFetch('/portal/consents'));
  }
  return (
    <AppShell title="Consent Records" subtitle={user?.role === 'DATA_PRINCIPAL' ? 'Your own consent records' : 'All consent records'}>
      <div className={ui.card}>
        {error && <div className={`${ui.error} mb-4`}>{error}</div>}
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>{['Consent ID', 'Name', 'Email', 'Domain', 'Choices', 'Status', 'Action'].map((header) => <th className={ui.th} key={header}>{header}</th>)}</tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr className={ui.tr} key={item._id}>
                  <td className={ui.td}>{item.consentId}</td>
                  <td className={ui.td}>{item.fullName}</td>
                  <td className={ui.td}>{item.email}</td>
                  <td className={ui.td}>{item.domainName}</td>
                  <td className={ui.td}>{item.categories?.map((c:any) => `${c.label}: ${c.accepted ? 'Yes' : 'No'}`).join(', ')}</td>
                  <td className={ui.td}><StatusBadge value={item.status} /></td>
                  <td className={ui.td}>{item.status === 'Active' && <button className={ui.secondaryButton} onClick={() => withdraw(item._id)}>Withdraw</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
