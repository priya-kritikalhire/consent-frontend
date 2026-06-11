'use client';

import { useState } from 'react';
import AppShell from '../../components/AppShell';
import { cx, ui } from '../../lib/styles';

const tabs = [
  { key: 'dsar', label: 'DSAR Requests', href: '/dsar', description: 'View and manage all DSAR requests from a single tab.' },
  { key: 'consents', label: 'Consent Records', href: '/consents', description: 'Review and manage all consent records from one place.' },
  { key: 'webforms', label: 'Webform Submissions', href: '/webforms', description: 'Browse webform submissions and process them as needed.' },
  { key: 'child-consents', label: 'Child Consent', href: '/child-consents', description: 'Track child consent requests and related records here.' },
];

export default function QuickNavigationPage() {
  const [activeTab, setActiveTab] = useState('dsar');
  const selected = tabs.find((tab) => tab.key === activeTab) ?? tabs[0];

  return (
    <AppShell title="Quick navigation">
      <div className={ui.card}>
        {/* <h2 className={ui.sectionTitle}>Quick navigation</h2> */}
        <div className={ui.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={cx(ui.tab, activeTab === tab.key && ui.activeTab)}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {/* <h2 className={ui.sectionTitle}>{selected.label}</h2>
          <p className={ui.subtle}>{selected.description}</p> */}
          <iframe className="mt-4 min-h-[800px] w-full rounded-lg border border-slate-200 bg-white" src={`/quick-navigation/embed/${selected.key}`} title={selected.label} />
        </div>
      </div>
    </AppShell>
  );
}
