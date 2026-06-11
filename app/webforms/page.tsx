'use client';
import { useEffect, useState } from 'react';
import AppShell from '../../components/AppShell';
import StatusBadge from '../../components/StatusBadge';
import { apiFetch, getUser } from '../../lib/api';
import { ui } from '../../lib/styles';

function renderValues(values: any) {
  if (!values) return '-';

  if (Array.isArray(values)) {
    return values
      .slice(0, 4)
      .map((item: any) => `${item.fieldId || item.label || item.name}: ${String(item.value ?? '-')}`)
      .join(', ');
  }

  if (typeof values === 'object') {
    return Object.entries(values)
      .slice(0, 4)
      .map(([key, value]) => `${key}: ${String(value ?? '-')}`)
      .join(', ');
  }

  return String(values);
}

export default function WebformsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const user = getUser();

  async function load(searchText = '') {
    setError('');
    try {
      const qs = searchText ? `?search=${encodeURIComponent(searchText)}` : '';
      setItems(await apiFetch(`/internal-webform-submissions/submissions${qs}`));
    } catch (e: any) {
      setError(e.message);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <AppShell
      title="Webform Submissions"
      subtitle={user?.role === 'DATA_PRINCIPAL' ? 'Your own webform consent submissions' : 'Fetched from existing webform submission collections in the same MongoDB database'}
    >
      <div className={ui.card}>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <input
            className={ui.input}
            placeholder="Search by email, domain, form, or field value"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className={ui.button} onClick={() => load(search)}>Search</button>
          <button className={ui.secondaryButton} onClick={() => { setSearch(''); load(''); }}>Reset</button>
        </div>
        {error && <div className={`${ui.error} mb-4`}>{error}</div>}
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>{['Form', 'Name', 'Email', 'Domain', 'Consent', 'Minor', 'Values', 'Created', 'Source'].map((header) => <th className={ui.th} key={header}>{header}</th>)}</tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className={ui.tr} key={`${item.sourceCollection}-${item._id}`}>
                  <td className={ui.td}>{item.formName || item.formId || '-'}</td>
                  <td className={ui.td}>{item.fullName || '-'}</td>
                  <td className={ui.td}>{item.email || '-'}</td>
                  <td className={ui.td}>{item.domain || item.domainName || '-'}</td>
                  <td className={ui.td}><StatusBadge value={item.consentStatusSnapshot || (item.consentAccepted ? 'APPROVED' : 'PENDING')} /></td>
                  <td className={ui.td}>{item.submittedByMinor ? 'Yes' : 'No'}</td>
                  <td className={ui.td}>{renderValues(item.values)}</td>
                  <td className={ui.td}>{item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</td>
                  <td className={ui.td}>{item.sourceCollection || 'portal'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
