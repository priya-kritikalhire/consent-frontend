'use client';

import { useEffect, useState } from 'react';
import StatusBadge from '../../../../components/StatusBadge';
import { apiFetch } from '../../../../lib/api';
import { cx, ui } from '../../../../lib/styles';

const tabConfig = {
  dsar: { title: 'DSAR Requests', description: 'View and manage all DSAR requests from a single tab.' },
  consents: { title: 'Consent Records', description: 'Review and manage all consent records from one place.' },
  webforms: { title: 'Webform Submissions', description: 'Browse webform submissions and process them as needed.' },
  'child-consents': { title: 'Child Consent', description: 'Track child consent requests and related records here.' },
};

function maskText(value: any) {
  const text = String(value ?? '');
  if (!text) return '-';
  if (text.length <= 2) return '*'.repeat(text.length);
  return `${text.slice(0, 2)}${'*'.repeat(Math.min(text.length - 2, 8))}`;
}

function maskEmail(value: any) {
  const email = String(value ?? '');
  if (!email || !email.includes('@')) return maskText(email);
  const [name, domain] = email.split('@');
  return `${name.slice(0, 2)}${'*'.repeat(Math.max(name.length - 2, 3))}@${domain}`;
}

function display(value: any, masked: boolean, type: 'text' | 'email' = 'text') {
  if (value === undefined || value === null || value === '') return '-';
  if (!masked) return String(value);
  return type === 'email' ? maskEmail(value) : maskText(value);
}

function formatDate(value: any) {
  return value ? new Date(value).toLocaleString() : '-';
}

function renderValues(values: any, masked: boolean) {
  if (!values) return '-';

  if (Array.isArray(values)) {
    return values
      .slice(0, 4)
      .map((item: any) => `${item.fieldId || item.label || item.name}: ${display(item.value, masked)}`)
      .join(', ');
  }

  if (typeof values === 'object') {
    return Object.entries(values)
      .slice(0, 4)
      .map(([key, value]) => `${key}: ${display(value, masked)}`)
      .join(', ');
  }

  return display(values, masked);
}

export default function EmbedTabPage({ params }: { params: { tab: string } }) {
  const { tab } = params;
  const config = tabConfig[tab as keyof typeof tabConfig] ?? tabConfig.dsar;
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [dataMode, setDataMode] = useState<'masked' | 'unmasked'>('masked');
  const [viewMode, setViewMode] = useState<'table' | 'form'>('table');
  const masked = dataMode === 'masked';

  async function load(searchText = '') {
    setError('');
    try {
      if (tab === 'dsar') {
        setItems(await apiFetch('/dsar'));
      } else if (tab === 'consents') {
        setItems(await apiFetch('/portal/consents'));
      } else if (tab === 'webforms') {
        const qs = searchText ? `?search=${encodeURIComponent(searchText)}` : '';
        setItems(await apiFetch(`/internal-webform-submissions/submissions${qs}`));
      } else if (tab === 'child-consents') {
        setItems(await apiFetch('/child-consent-submissions'));
      }
    } catch (e: any) {
      setError(e?.message || 'Unable to load content');
    }
  }

  useEffect(() => {
    setSearch('');
    load('');
  }, [tab]);

  function getFields(item: any) {
    if (tab === 'dsar') {
      return [
        ['Request ID', item.requestId],
        ['Name', display(item.fullName, masked)],
        ['Email', display(item.email, masked, 'email')],
        ['Type', item.requestTypes?.join(', ') || '-'],
        ['Status', item.status],
        ['Created', formatDate(item.createdAt)],
        ['Source', item.sourceCollection || 'portal'],
      ];
    }

    if (tab === 'consents') {
      return [
        ['Consent ID', item.consentId],
        ['Name', display(item.fullName, masked)],
        ['Email', display(item.email, masked, 'email')],
        ['Domain', display(item.domainName || item.domain, masked)],
        ['Choices', item.categories?.map((c: any) => `${c.label}: ${c.accepted ? 'Yes' : 'No'}`).join(', ') || '-'],
        ['Status', item.status],
      ];
    }

    if (tab === 'webforms') {
      return [
        ['Form', item.formName || item.formId || '-'],
        ['Name', display(item.fullName, masked)],
        ['Email', display(item.email, masked, 'email')],
        ['Domain', display(item.domain || item.domainName, masked)],
        ['Consent', item.consentStatusSnapshot || (item.consentAccepted ? 'APPROVED' : 'PENDING')],
        ['Minor', item.submittedByMinor ? 'Yes' : 'No'],
        ['Values', renderValues(item.values, masked)],
        ['Created', formatDate(item.createdAt)],
      ];
    }

    return [
      ['Consent ID', item.consentId || item.submissionId],
      ['Name', display(item.fullName, masked)],
      ['Email', display(item.email, masked, 'email')],
      ['Age', item.age ?? '-'],
      ['Flow', item.flowType === 'minor_consent' ? 'Minor / Parent Consent' : 'Adult Self Consent'],
      ['Guardian', item.guardianName ? `${display(item.guardianName, masked)} (${display(item.guardianEmail, masked, 'email')})` : '-'],
      ['Domain', display(item.domain, masked)],
      ['Status', item.status],
    ];
  }

  const headers = getFields(items[0] || {}).map(([label]) => label);

  return (
    <div className="min-h-screen bg-white p-4 text-slate-950 sm:p-5">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">{config.title}</h1>
          <p className={ui.subtle}>{config.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className={ui.modeToggle}>
            <button className={cx(ui.modeButton, dataMode === 'masked' && ui.activeModeButton)} onClick={() => setDataMode('masked')}>Masked Data</button>
            <button className={cx(ui.modeButton, dataMode === 'unmasked' && ui.activeModeButton)} onClick={() => setDataMode('unmasked')}>Without Mask Data</button>
          </div>
          <div className={ui.modeToggle}>
            <button className={cx(ui.modeButton, viewMode === 'table' && ui.activeModeButton)} onClick={() => setViewMode('table')}>Table View</button>
            <button className={cx(ui.modeButton, viewMode === 'form' && ui.activeModeButton)} onClick={() => setViewMode('form')}>Form View</button>
          </div>
        </div>
      </div>

      {tab === 'webforms' && (
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
      )}

      {error && <div className={`${ui.error} mb-4`}>{error}</div>}

      {viewMode === 'table' ? (
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>{headers.map((label) => <th className={ui.th} key={label}>{label}</th>)}</tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr className={ui.tr} key={item._id || `${tab}-${index}`}>
                  {getFields(item).map(([label, value]) => (
                    <td className={ui.td} key={label}>{label === 'Status' || label === 'Consent' ? <StatusBadge value={String(value)} /> : value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item, index) => (
            <div className={ui.card} key={item._id || `${tab}-${index}`}>
              {getFields(item).map(([label, value]) => (
                <div className={`${ui.field} mb-3 last:mb-0`} key={label}>
                  <label className={ui.label}>{label}</label>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700">{label === 'Status' || label === 'Consent' ? <StatusBadge value={String(value)} /> : value}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {!items.length && !error && <div className={`${ui.notice} mt-4`}>No records available for this request section.</div>}
    </div>
  );
}
