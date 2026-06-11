'use client';
import { useEffect, useState } from 'react';
import AppShell from '../../components/AppShell';
import { apiFetch } from '../../lib/api';
import { ui } from '../../lib/styles';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: 'Temp@12345', role: 'VIEWER' });
  async function load() {
    setUsers(await apiFetch('/portal/users'));
    setRoles(await apiFetch('/portal/rbac/roles'));
  }
  useEffect(() => { load().catch(e => setError(e.message)); }, []);
  async function create(e: React.FormEvent) {
    e.preventDefault(); setError('');
    try { await apiFetch('/portal/users', { method: 'POST', body: JSON.stringify(form) }); setForm({ name: '', email: '', password: 'Temp@12345', role: 'VIEWER' }); await load(); }
    catch (err: any) { setError(err.message); }
  }
  return (
    <AppShell title="Users & RBAC" subtitle="Create portal users and assign portal roles">
      <div className={ui.grid2}>
        <div className={ui.card}>
          <h2 className={`${ui.sectionTitle} mb-4`}>Create User</h2>
          <form className={ui.form} onSubmit={create}>
            {error && <div className={ui.error}>{error}</div>}
            <div className={ui.field}><label className={ui.label}>Name</label><input className={ui.input} required value={form.name} onChange={e => setForm({...form, name:e.target.value})} /></div>
            <div className={ui.field}><label className={ui.label}>Email</label><input className={ui.input} required type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} /></div>
            <div className={ui.field}><label className={ui.label}>Password</label><input className={ui.input} required value={form.password} onChange={e => setForm({...form, password:e.target.value})} /></div>
            <div className={ui.field}><label className={ui.label}>Role</label><select className={ui.select} value={form.role} onChange={e => setForm({...form, role:e.target.value})}>{roles.map(r => <option key={r.role}>{r.role}</option>)}</select></div>
            <button className={ui.button}>Create</button>
          </form>
        </div>
        <div className={ui.card}>
          <h2 className={`${ui.sectionTitle} mb-4`}>Roles</h2>
          <div className={ui.tableWrap}>
            <table className={ui.table}>
              <tbody>{roles.map(r => <tr className={ui.tr} key={r.role}><td className={`${ui.td} font-bold text-slate-950`}>{r.role}</td><td className={ui.td}>{r.permissions.join(', ')}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </div>
      <div className={`${ui.card} mt-4`}>
        <h2 className={`${ui.sectionTitle} mb-4`}>Users</h2>
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead><tr>{['Name', 'Email', 'Role', 'Active'].map((header) => <th className={ui.th} key={header}>{header}</th>)}</tr></thead>
            <tbody>{users.map(u => <tr className={ui.tr} key={u._id}><td className={ui.td}>{u.name}</td><td className={ui.td}>{u.email}</td><td className={ui.td}>{u.role}</td><td className={ui.td}>{String(u.isActive)}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
