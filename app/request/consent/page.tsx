'use client';
import { useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../../lib/api';
import { ui } from '../../../lib/styles';

const defaultCategories = [
  { key: 'necessary', label: 'Necessary', accepted: true },
  { key: 'analytics', label: 'Analytics', accepted: false },
  { key: 'marketing', label: 'Marketing', accepted: false },
  { key: 'personalization', label: 'Personalization', accepted: false },
];

export default function PublicConsentPage() {
  const [form, setForm] = useState({ fullName: '', email: '', domainName: '', tenantId: 'default-tenant' });
  const [categories, setCategories] = useState(defaultCategories);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const update = (k: string, v: string) => setForm({ ...form, [k]: v });
  const toggle = (key: string) => setCategories(categories.map(c => c.key === key ? { ...c, accepted: !c.accepted } : c));
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setResult(null);
    try { setResult(await apiFetch('/public/consents', { method: 'POST', body: JSON.stringify({ ...form, categories }) })); }
    catch (err: any) { setError(err.message); }
  }
  return (
    <div className={ui.publicShell}>
      <div className={ui.publicCard}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h1 className={ui.title}>Submit Consent</h1><Link className={ui.secondaryButton} href="/login">Portal Login</Link></div>
        <p className={ui.subtle}>After submission, login credentials are created automatically for the requester.</p>
        <form className={`${ui.form} mt-5`} onSubmit={submit}>
          {error && <div className={ui.error}>{error}</div>}
          {result && <div className={ui.notice}>Submitted successfully. Consent ID: {result.consent?.consentId}{result.devCredentials ? `\nDev credentials: ${result.devCredentials.email} / ${result.devCredentials.temporaryPassword}` : ''}</div>}
          <div className={ui.grid2}><div className={ui.field}><label className={ui.label}>Full name</label><input className={ui.input} required value={form.fullName} onChange={e => update('fullName', e.target.value)} /></div><div className={ui.field}><label className={ui.label}>Email</label><input className={ui.input} required type="email" value={form.email} onChange={e => update('email', e.target.value)} /></div></div>
          <div className={ui.grid2}><div className={ui.field}><label className={ui.label}>Domain name</label><input className={ui.input} required value={form.domainName} onChange={e => update('domainName', e.target.value)} placeholder="example.com" /></div><div className={ui.field}><label className={ui.label}>Tenant ID</label><input className={ui.input} value={form.tenantId} onChange={e => update('tenantId', e.target.value)} /></div></div>
          <div className={ui.field}><label className={ui.label}>Consent categories</label>{categories.map(c => <label className={ui.checkboxRow} key={c.key}><input className={ui.checkbox} type="checkbox" checked={c.accepted} disabled={c.key === 'necessary'} onChange={() => toggle(c.key)} />{c.label}</label>)}</div>
          <button className={ui.button}>Save Consent</button>
        </form>
      </div>
    </div>
  );
}
