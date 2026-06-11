'use client';
import { useEffect, useState } from 'react';
import AppShell from '../../components/AppShell';
import StatusBadge from '../../components/StatusBadge';
import { apiFetch, getUser } from '../../lib/api';
import { ui } from '../../lib/styles';

export default function ChildConsentsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState('');
  const user = getUser();

  async function load() {
    setError('');
    try {
      setItems(await apiFetch('/child-consent-submissions'));
    } catch (e: any) {
      setError(e.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function withdraw(id: string) {
    const reason = prompt('Reason for withdrawal?') || '';
    await apiFetch(`/child-consent-submissions/${id}/withdraw`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    await load();
  }

  return (
    <AppShell
      title="Child Consent Records"
      subtitle={user?.role === 'DATA_PRINCIPAL' ? 'Your child/adult age-based consent records' : 'All age-based child consent submissions'}
    >
      <div className={ui.card}>
        {error && <div className={`${ui.error} mb-4`}>{error}</div>}
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>{['Consent ID', 'Name', 'Email', 'Age', 'Flow', 'Guardian', 'Domain', 'Status', 'Source', 'Action'].map((header) => <th className={ui.th} key={header}>{header}</th>)}</tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className={ui.tr} key={item._id}>
                  <td className={ui.td}>{item.consentId || item.submissionId}</td>
                  <td className={ui.td}>{item.fullName}</td>
                  <td className={ui.td}>{item.email}</td>
                  <td className={ui.td}>{item.age ?? '-'}</td>
                  <td className={ui.td}>{item.flowType === 'minor_consent' ? 'Minor / Parent Consent' : 'Adult Self Consent'}</td>
                  <td className={ui.td}>{item.guardianName ? `${item.guardianName} (${item.guardianEmail || '-'})` : '-'}</td>
                  <td className={ui.td}>{item.domain}</td>
                  <td className={ui.td}><StatusBadge value={item.status} /></td>
                  <td className={ui.td}>{item.sourceCollection || 'portal'}</td>
                  <td className={ui.td}>
                    {item.status !== 'Withdrawn' && (
                      <button className={ui.secondaryButton} onClick={() => withdraw(item._id)}>
                        Withdraw
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
