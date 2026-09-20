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
      icon: <Layers className="w-4 h-4 text-indigo-400" />,
      accent: 'border-indigo-500/20 bg-indigo-500/5',
      textColor: 'text-indigo-300'
    },
    {
      label: 'Unique Sessions',
      value: metrics.uniqueSessions,
      icon: <Fingerprint className="w-4 h-4 text-cyan-400" />,
      accent: 'border-cyan-500/20 bg-cyan-500/5',
      textColor: 'text-cyan-300'
    },
    {
      label: 'Unique Anonymous IDs',
      value: metrics.uniqueAnonymousIds,
      icon: <Users className="w-4 h-4 text-amber-400" />,
      accent: 'border-amber-500/20 bg-amber-500/5',
      textColor: 'text-amber-300'
    },
    {
      label: 'Unique Customers',
      value: metrics.uniqueCustomers,
      icon: <UserCheck className="w-4 h-4 text-emerald-400" />,
      accent: 'border-emerald-500/20 bg-emerald-500/5',
      textColor: 'text-emerald-300'
    },
    {
      label: 'Web Events',
      value: metrics.webEvents,
      icon: <Globe className="w-4 h-4 text-blue-400" />,
      accent: 'border-blue-500/20 bg-blue-500/5',
      textColor: 'text-blue-300'
    },
    {
      label: 'Mobile Events',
      value: metrics.mobileEvents,
      icon: <Smartphone className="w-4 h-4 text-purple-400" />,
      accent: 'border-purple-500/20 bg-purple-500/5',
      textColor: 'text-purple-300'
    },
    {
      label: 'Call Center Events',
      value: metrics.callCenterEvents,
      icon: <PhoneCall className="w-4 h-4 text-amber-400" />,
      accent: 'border-amber-500/20 bg-amber-500/5',
      textColor: 'text-amber-300'
    },
    {
      label: 'Store Events',
      value: metrics.storeEvents,
      icon: <Store className="w-4 h-4 text-emerald-400" />,
      accent: 'border-emerald-500/20 bg-emerald-500/5',
      textColor: 'text-emerald-300'
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-mono font-semibold tracking-wider text-gray-400 uppercase">
          Live Event Store Metrics (Calculated Dynamically)
        </h3>
        <span className="text-[11px] font-mono text-gray-400">Sync: Real-time In-memory</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`p-3.5 rounded-xl border ${c.accent} backdrop-blur-sm bg-gray-900/60 transition-all hover:scale-[1.02] shadow-sm flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-gray-400 font-medium truncate pr-1">{c.label}</span>
              <div className="p-1 rounded bg-gray-800/80 shrink-0">{c.icon}</div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono tracking-tight text-white">{c.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
