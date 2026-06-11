'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../../lib/api';
import { ui } from '../../../lib/styles';

function calculateAge(dob: string) {
  if (!dob) return null;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export default function PublicChildConsentPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    dob: '',
    domain: '',
    tenantId: 'default-tenant',
    guardianName: '',
    guardianEmail: '',
    guardianPhone: '',
    relationship: '',
    adultAgeConfirm: false,
    adultConsent: false,
    guardianDeclaration: false,
    guardianConsent: false,
  });
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const age = useMemo(() => calculateAge(form.dob), [form.dob]);
  const isMinor = age !== null && age < 18;
  const flowType = isMinor ? 'minor_consent' : 'adult_consent';

  const update = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setResult(null);

    try {
      const cfg = await apiFetch(
        `/child-consent-configs?domain=${encodeURIComponent(form.domain)}&tenantId=${encodeURIComponent(form.tenantId)}`,
      );

      const values = {
        cmpUserId: `portal-${Date.now()}`,
        fullName: form.fullName,
        email: form.email,
        dob: form.dob,
        age,
        adultAgeConfirm: form.adultAgeConfirm,
        adultConsent: form.adultConsent,
        guardianName: form.guardianName,
        guardianEmail: form.guardianEmail,
        guardianPhone: form.guardianPhone,
        relationship: form.relationship,
        guardianDeclaration: form.guardianDeclaration,
        guardianConsent: form.guardianConsent,
      };

      const start = await apiFetch('/child-consent-submissions/start', {
        method: 'POST',
        body: JSON.stringify({
          configId: cfg._id,
          tenantId: form.tenantId,
          domain: form.domain,
          formId: cfg.formId || 'child-consent-widget',
          flowType,
          values,
          meta: { source: 'portal-public-child-consent-page' },
        }),
      });

      const finalized = await apiFetch('/child-consent-submissions/finalize', {
        method: 'POST',
        body: JSON.stringify({
          submissionId: start.submissionId,
          flowType,
          values,
        }),
      });

      setResult(finalized);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className={ui.publicShell}>
      <div className={ui.publicCard}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className={ui.title}>Submit Child Consent</h1>
          <Link className={ui.secondaryButton} href="/login">Portal Login</Link>
        </div>
        <p className={ui.subtle}>
          This form automatically switches between adult self-consent and parent/guardian consent based on date of birth.
          After submission, a requester login is created automatically.
        </p>

        <form className={`${ui.form} mt-5`} onSubmit={submit}>
          {error && <div className={ui.error}>{error}</div>}
          {result && (
            <div className={ui.notice}>
              Submitted successfully. Consent ID: {result.consentId}
              {result.devCredentials ? `\nDev credentials: ${result.devCredentials.email} / ${result.devCredentials.temporaryPassword}` : ''}
            </div>
          )}

          <div className={ui.grid2}>
            <div className={ui.field}>
              <label className={ui.label}>Full name</label>
              <input className={ui.input} required value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
            </div>
            <div className={ui.field}>
              <label className={ui.label}>Email</label>
              <input className={ui.input} required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
            </div>
          </div>

          <div className={ui.grid2}>
            <div className={ui.field}>
              <label className={ui.label}>Date of birth</label>
              <input className={ui.input} required type="date" value={form.dob} onChange={(e) => update('dob', e.target.value)} />
              {age !== null && <span className={ui.subtle}>Calculated age: {age}. Flow: {isMinor ? 'Minor consent' : 'Adult consent'}.</span>}
            </div>
            <div className={ui.field}>
              <label className={ui.label}>Domain name</label>
              <input className={ui.input} required value={form.domain} onChange={(e) => update('domain', e.target.value)} placeholder="example.com" />
            </div>
          </div>

          <div className={ui.field}>
            <label className={ui.label}>Tenant ID</label>
            <input className={ui.input} value={form.tenantId} onChange={(e) => update('tenantId', e.target.value)} />
          </div>

          {isMinor ? (
            <div className={ui.flatCard}>
              <h2 className={`${ui.sectionTitle} mb-4`}>Parent / Guardian Consent</h2>
              <div className={ui.grid2}>
                <div className={ui.field}>
                  <label className={ui.label}>Parent/Guardian full name</label>
                  <input className={ui.input} required value={form.guardianName} onChange={(e) => update('guardianName', e.target.value)} />
                </div>
                <div className={ui.field}>
                  <label className={ui.label}>Parent/Guardian email</label>
                  <input className={ui.input} required type="email" value={form.guardianEmail} onChange={(e) => update('guardianEmail', e.target.value)} />
                </div>
              </div>
              <div className={`${ui.grid2} mt-4`}>
                <div className={ui.field}>
                  <label className={ui.label}>Phone</label>
                  <input className={ui.input} value={form.guardianPhone} onChange={(e) => update('guardianPhone', e.target.value)} />
                </div>
                <div className={ui.field}>
                  <label className={ui.label}>Relationship</label>
                  <select className={ui.select} required value={form.relationship} onChange={(e) => update('relationship', e.target.value)}>
                    <option value="">Select relationship</option>
                    <option>Mother</option>
                    <option>Father</option>
                    <option>Legal Guardian</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <label className={`${ui.checkboxRow} mt-4`}>
                <input className={ui.checkbox} required type="checkbox" checked={form.guardianDeclaration} onChange={(e) => update('guardianDeclaration', e.target.checked)} />
                I confirm that I am the parent or legal guardian of the child.
              </label>
              <label className={`${ui.checkboxRow} mt-3`}>
                <input className={ui.checkbox} required type="checkbox" checked={form.guardianConsent} onChange={(e) => update('guardianConsent', e.target.checked)} />
                I consent to the processing of the child's personal data.
              </label>
            </div>
          ) : (
            <div className={ui.flatCard}>
              <h2 className={`${ui.sectionTitle} mb-4`}>Adult Self Consent</h2>
              <label className={ui.checkboxRow}>
                <input className={ui.checkbox} required type="checkbox" checked={form.adultAgeConfirm} onChange={(e) => update('adultAgeConfirm', e.target.checked)} />
                I confirm that I am 18 years of age or older.
              </label>
              <label className={`${ui.checkboxRow} mt-3`}>
                <input className={ui.checkbox} required type="checkbox" checked={form.adultConsent} onChange={(e) => update('adultConsent', e.target.checked)} />
                I have read and agree to the privacy notice and consent terms.
              </label>
            </div>
          )}

          <button className={ui.button}>Submit Child Consent</button>
        </form>
      </div>
    </div>
  );
}
