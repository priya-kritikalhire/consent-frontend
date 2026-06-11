'use client';
import { useEffect, useState } from 'react';
import {
  FaBaby,
  FaCheckCircle,
  FaChild,
  FaClipboardCheck,
  FaClipboardList,
  FaHourglassHalf,
  FaPaperPlane,
  FaTasks,
  FaTimesCircle,
  FaUserCheck,
  FaUserShield,
  FaWpforms,
} from 'react-icons/fa';

import AppShell from '../../components/AppShell';
import { apiFetch, getUser } from '../../lib/api';
import { ui } from '../../lib/styles';

const stats = [
  {
    label: 'Total DSAR',
    value: (summary: any) => summary?.dsar?.total,
    color: 'text-blue-700',
    accent: 'bg-blue-50 border-blue-100',
    icon: FaClipboardList,
  },
  {
    label: 'Pending DSAR',
    value: (summary: any) => summary?.dsar?.pending,
    color: 'text-amber-600',
    accent: 'bg-amber-50 border-amber-100',
    icon: FaHourglassHalf,
  },
  {
    label: 'In Progress DSAR',
    value: (summary: any) => summary?.dsar?.inProgress,
    color: 'text-sky-700',
    accent: 'bg-sky-50 border-sky-100',
    icon: FaTasks,
  },
  {
    label: 'Completed DSAR',
    value: (summary: any) => summary?.dsar?.completed,
    color: 'text-emerald-600',
    accent: 'bg-emerald-50 border-emerald-100',
    icon: FaClipboardCheck,
  },
  {
    label: 'Total Consents',
    value: (summary: any) => summary?.consent?.total,
    color: 'text-blue-700',
    accent: 'bg-blue-50 border-blue-100',
    icon: FaCheckCircle,
  },
  {
    label: 'Active Consents',
    value: (summary: any) => summary?.consent?.active,
    color: 'text-emerald-600',
    accent: 'bg-emerald-50 border-emerald-100',
    icon: FaCheckCircle,
  },
  {
    label: 'Web Withdraw',
    value: (summary: any) => summary?.consent?.withdrawn,
    color: 'text-red-600',
    accent: 'bg-red-50 border-red-100',
    icon: FaTimesCircle,
  },
  {
    label: 'Child Consent Total',
    value: (summary: any) => summary?.childConsent?.total,
    color: 'text-indigo-700',
    accent: 'bg-indigo-50 border-indigo-100',
    icon: FaChild,
  },
  {
    label: 'Minor Consents',
    value: (summary: any) => summary?.childConsent?.minor,
    color: 'text-violet-700',
    accent: 'bg-violet-50 border-violet-100',
    icon: FaUserShield,
  },
  {
    label: 'Adult Age-Based Consents',
    value: (summary: any) => summary?.childConsent?.adult,
    color: 'text-cyan-700',
    accent: 'bg-cyan-50 border-cyan-100',
    icon: FaUserCheck,
  },
  {
    label: 'Submitted Child Consents',
    value: (summary: any) => summary?.childConsent?.submitted,
    color: 'text-teal-700',
    accent: 'bg-teal-50 border-teal-100',
    icon: FaPaperPlane,
  },
  {
    label: 'Child Consent Withdrawn',
    value: (summary: any) => summary?.childConsent?.withdrawn,
    color: 'text-rose-600',
    accent: 'bg-rose-50 border-rose-100',
    icon: FaTimesCircle,
  },
  {
    label: 'Webform Submissions',
    value: (summary: any) => summary?.webform?.total,
    color: 'text-sky-700',
    accent: 'bg-sky-50 border-sky-100',
    icon: FaWpforms,
  },
  {
    label: 'Webform Approved',
    value: (summary: any) => summary?.webform?.approved,
    color: 'text-emerald-600',
    accent: 'bg-emerald-50 border-emerald-100',
    icon: FaCheckCircle,
  },
  {
    label: 'Webform Pending',
    value: (summary: any) => summary?.webform?.pending,
    color: 'text-amber-600',
    accent: 'bg-amber-50 border-amber-100',
    icon: FaHourglassHalf,
  },
  {
    label: 'Webform Minor',
    value: (summary: any) => summary?.webform?.minor,
    color: 'text-purple-700',
    accent: 'bg-purple-50 border-purple-100',
    icon: FaBaby,
  },
];

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
    apiFetch('/portal/dashboard/summary').then(setSummary).catch(console.error);
  }, []);

  return (
    <AppShell
      title="Dashboard"
      subtitle={user ? `Logged in as ${user.name || ''} (${user.role || ''})` : 'Loading user...'}
    >
      <div className={ui.grid}>
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className={`${ui.card} ${stat.accent}`} key={stat.label}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-slate-500">{stat.label}</div>
                  <div className={`mt-2 text-3xl font-bold ${stat.color}`}>
                    {stat.value(summary) ?? '-'}
                  </div>
                </div>

                <div className={`rounded-full bg-white p-3 text-2xl shadow-sm ${stat.color}`}>
                  <Icon />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
