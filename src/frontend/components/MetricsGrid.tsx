import React from 'react';
import { DashboardMetrics } from '../../shared/types';
import { Layers, Fingerprint, UserCheck, Users, Globe, Smartphone, PhoneCall, Store } from 'lucide-react';

interface MetricsGridProps {
  metrics: DashboardMetrics;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  const cards = [
    {
      label: 'Total Events',
      value: metrics.totalEvents,
      icon: <Layers className="w-4 h-4 text-indigo-600" />,
      accent: 'border-indigo-100 bg-indigo-50/40'
    },
    {
      label: 'Unique Sessions',
      value: metrics.uniqueSessions,
      icon: <Fingerprint className="w-4 h-4 text-cyan-600" />,
      accent: 'border-cyan-100 bg-cyan-50/40'
    },
    {
      label: 'Unique Anonymous IDs',
      value: metrics.uniqueAnonymousIds,
      icon: <Users className="w-4 h-4 text-amber-600" />,
      accent: 'border-amber-100 bg-amber-50/40'
    },
    {
      label: 'Unique Customers',
      value: metrics.uniqueCustomers,
      icon: <UserCheck className="w-4 h-4 text-emerald-600" />,
      accent: 'border-emerald-100 bg-emerald-50/40'
    },
    {
      label: 'Web Events',
      value: metrics.webEvents,
      icon: <Globe className="w-4 h-4 text-blue-600" />,
      accent: 'border-blue-100 bg-blue-50/40'
    },
    {
      label: 'Mobile Events',
      value: metrics.mobileEvents,
      icon: <Smartphone className="w-4 h-4 text-purple-600" />,
      accent: 'border-purple-100 bg-purple-50/40'
    },
    {
      label: 'Call Center Events',
      value: metrics.callCenterEvents,
      icon: <PhoneCall className="w-4 h-4 text-amber-600" />,
      accent: 'border-amber-100 bg-amber-50/40'
    },
    {
      label: 'Store Events',
      value: metrics.storeEvents,
      icon: <Store className="w-4 h-4 text-emerald-600" />,
      accent: 'border-emerald-100 bg-emerald-50/40'
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-mono font-semibold tracking-wider text-slate-500 uppercase">
          Live Event Store Metrics (Calculated Dynamically)
        </h3>
        <span className="text-[11px] font-mono text-slate-500">Sync: Real-time In-memory</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`p-3.5 rounded-xl border ${c.accent} bg-white shadow-xs transition-all hover:scale-[1.02] hover:shadow-md flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-slate-500 font-medium truncate pr-1">{c.label}</span>
              <div className="p-1 rounded bg-slate-100 shrink-0">{c.icon}</div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono tracking-tight text-slate-900">{c.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
