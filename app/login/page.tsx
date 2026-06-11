'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { apiFetch, setSession } from '../../lib/api';
import { cx, ui } from '../../lib/styles';

type LoginMode = 'password' | 'otp';

export default function LoginPage() {
  const router = useRouter();
  const [loginMode, setLoginMode] = useState<LoginMode>('password');
  const [email, setEmail] = useState('admin@grc3.io');
  const [password, setPassword] = useState('Admin@12345');
  const [otp, setOtp] = useState('');
  const [tenantId, setTenantId] = useState('default-tenant');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  function completeLogin(data: any) {
    setSession(data.accessToken, data.user);
    router.push('/dashboard');
  }

  async function requestOtp() {
    setSendingOtp(true);
    setError('');
    setNotice('');
    try {
      const data = await apiFetch('/portal/auth/otp/send', {
        method: 'POST',
        body: JSON.stringify({ email, tenantId }),
      });
      const devOtpMessage = data?.devOtp ? ` Dev OTP: ${data.devOtp}` : '';
      setNotice(`${data?.message || `OTP sent to ${email}. Please check your mailbox.`}${devOtpMessage}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSendingOtp(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(''); setNotice('');
    try {
      const data = loginMode === 'password'
        ? await apiFetch('/portal/auth/login', { method: 'POST', body: JSON.stringify({ email, password, tenantId }) })
        : await apiFetch('/portal/auth/otp/login', { method: 'POST', body: JSON.stringify({ email, otp, tenantId }) });
      completeLogin(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 px-4 py-8">
      <form className={`${ui.publicCard} max-w-md ${ui.form}`} onSubmit={submit}>
        <div>
          <h1 className={ui.title}>Portal Login</h1>
          <div className={ui.subtle}>Separate login for Consent + DSAR portal</div>
        </div>
        <div className={ui.modeToggle} role="tablist" aria-label="Login method">
          <button type="button" className={cx(ui.modeButton, loginMode === 'password' && ui.activeModeButton)} onClick={() => setLoginMode('password')}>Password</button>
          <button type="button" className={cx(ui.modeButton, loginMode === 'otp' && ui.activeModeButton)} onClick={() => setLoginMode('otp')}>OTP</button>
        </div>
        {error && <div className={ui.error}>{error}</div>}
        {notice && <div className={ui.notice}>{notice}</div>}
        <div className={ui.field}><label className={ui.label}>Email</label><input className={ui.input} required type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
        {loginMode === 'password' ? (
          <div className={ui.field}>
            <label className={ui.label}>Password</label>
            <div className="relative">
              <input className={`${ui.input} pr-11`} required type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} />
              <button type="button" className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 transition hover:text-blue-700" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(value => !value)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        ) : (
          <div className={ui.field}>
            <label className={ui.label}>OTP</label>
            <div className="relative">
              <input className={`${ui.input} pr-11`} required inputMode="numeric" type={showOtp ? 'text' : 'password'} value={otp} onChange={e => setOtp(e.target.value)} />
              <button type="button" className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 transition hover:text-blue-700" aria-label={showOtp ? 'Hide OTP' : 'Show OTP'} onClick={() => setShowOtp(value => !value)}>
                {showOtp ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button type="button" className={ui.secondaryButton} disabled={sendingOtp || !email || !tenantId} onClick={requestOtp}>
              {sendingOtp ? 'Sending OTP...' : 'Send OTP to email'}
            </button>
          </div>
        )}
        <div className={ui.field}><label className={ui.label}>Tenant ID</label><input className={ui.input} value={tenantId} onChange={e => setTenantId(e.target.value)} /></div>
        <button className={ui.button} disabled={loading}>{loading ? 'Signing in...' : loginMode === 'password' ? 'Login with password' : 'Login with OTP'}</button>
        <div className={ui.subtle}>Default admin uses values from backend .env. Requesters can sign in with password or email OTP.</div>
      </form>
    </div>
  );
}
