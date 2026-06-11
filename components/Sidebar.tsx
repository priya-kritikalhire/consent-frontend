'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiGrid, FiLogOut, FiShield, FiUsers } from 'react-icons/fi';
import { clearSession, getUser } from '../lib/api';

export default function Sidebar() {
  const router = useRouter();
  const user = getUser();
  const isDataPrincipal = user?.role === 'DATA_PRINCIPAL';

  return (
    <aside className="bg-[#2B245C] p-5 text-white shadow-lg lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:shrink-0">
      <div className="mb-8">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/15 text-xl">
          <FiShield />
        </div>
        <div className="mt-3 text-xl font-bold">Consent Management</div>
        <div className="mt-1 text-sm text-blue-100">GRC3 Portal</div>
      </div>
      <nav className="grid gap-2">
        <Link className="flex items-center gap-3 rounded-lg px-3.5 py-3 text-sm font-semibold text-white transition hover:bg-white/15" href="/dashboard">
          <FiGrid /> Dashboard
        </Link>
        <Link className="flex items-center gap-3 rounded-lg px-3.5 py-3 text-sm font-semibold text-white transition hover:bg-white/15" href="/quick-navigation">
          <FiShield /> Requests
        </Link>
      </nav>
      <nav className="mt-5 grid gap-2 border-t border-white/15 pt-5">
        {!isDataPrincipal && (
          <Link className="flex items-center gap-3 rounded-lg px-3.5 py-3 text-sm font-semibold text-white transition hover:bg-white/15" href="/users">
            <FiUsers /> Users & RBAC
          </Link>
        )}
        <button className="flex items-center gap-3 rounded-lg px-3.5 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/15" onClick={() => { clearSession(); router.push('/login'); }}>
          <FiLogOut /> Logout
        </button>
      </nav>
    </aside>
  );
}
