'use client';
import { useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../../lib/api';
import { ui } from '../../../lib/styles';

export default function PublicDsarPage() {
  const [form, setForm] = useState({ fullName: '', email: '', country: 'India', domainName: '', notes: '', tenantId: 'default-tenant', confirmAuth: true });
  const [requestTypes, setRequestTypes] = useState<string[]>(['Access My Data']);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const types = ['Access My Data', 'Correct My Data', 'Delete My Data', 'Withdraw Consent', 'Data Portability'];
  const update = (k: string, v: string | boolean) => setForm({ ...form, [k]: v });
  const toggleType = (t: string) => setRequestTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setResult(null);
    try { setResult(await apiFetch('/dsar', { method: 'POST', body: JSON.stringify({ ...form, requestTypes }) })); }
    catch (err: any) { setError(err.message); }
  }
  return (
    <div className={ui.publicShell}>
      <div className={ui.publicCard}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h1 className={ui.title}>Submit DSAR Request</h1><Link className={ui.secondaryButton} href="/login">Portal Login</Link></div>
        <p className={ui.subtle}>After submission, login credentials are created automatically for the requester.</p>
        <form className={`${ui.form} mt-5`} onSubmit={submit}>
          {error && <div className={ui.error}>{error}</div>}
          {result && <div className={ui.notice}>Submitted successfully. Request ID: {result.request?.requestId}{result.devCredentials ? `\nDev credentials: ${result.devCredentials.email} / ${result.devCredentials.temporaryPassword}` : ''}</div>}
          <div className={ui.grid2}><div className={ui.field}><label className={ui.label}>Full name</label><input className={ui.input} required value={form.fullName} onChange={e => update('fullName', e.target.value)} /></div><div className={ui.field}><label className={ui.label}>Email</label><input className={ui.input} required type="email" value={form.email} onChange={e => update('email', e.target.value)} /></div></div>
          <div className={ui.grid2}><div className={ui.field}><label className={ui.label}>Country</label><input className={ui.input} required value={form.country} onChange={e => update('country', e.target.value)} /></div><div className={ui.field}><label className={ui.label}>Domain name</label><input className={ui.input} value={form.domainName} onChange={e => update('domainName', e.target.value)} placeholder="example.com" /></div></div>
          <div className={ui.field}><label className={ui.label}>Request types</label>{types.map(t => <label className={ui.checkboxRow} key={t}><input className={ui.checkbox} type="checkbox" checked={requestTypes.includes(t)} onChange={() => toggleType(t)} />{t}</label>)}</div>
          <div className={ui.field}><label className={ui.label}>Notes</label><textarea className={ui.textarea} value={form.notes} onChange={e => update('notes', e.target.value)} /></div>
          <div className={ui.field}><label className={ui.label}>Tenant ID</label><input className={ui.input} value={form.tenantId} onChange={e => update('tenantId', e.target.value)} /></div>
          <label className={ui.checkboxRow}><input className={ui.checkbox} type="checkbox" checked={form.confirmAuth} onChange={e => update('confirmAuth', e.target.checked)} /> I confirm that I am authorized to submit this request.</label>
          <button className={ui.button}>Submit DSAR</button>
        </form>
      </div>
    </div>
  );
}
