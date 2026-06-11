'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import { getToken } from '../lib/api';
import { ui } from '../lib/styles';

export default function AppShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => { if (!getToken()) router.push('/login'); }, [router]);
  return (
    <div className={ui.appPage}>
      <Sidebar />
      <main className={ui.main}>
        <div className={ui.topbar}>
          <div>
            <h1 className={ui.title}>{title}</h1>
            {subtitle && <div className={ui.subtle}>{subtitle}</div>}
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
