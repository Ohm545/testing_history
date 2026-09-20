import React, { useState } from 'react';
import { ScenarioMetadata } from '../../shared/types';
import { ChannelBadge } from './StatusBadge';
import {
  Network,
  LogIn,
  HelpCircle,
  AlertTriangle,
  ShoppingCart,
  CreditCard,
  PhoneCall,
  RotateCcw,
  Users,
  Smartphone,
  Store,
  Tablet,
  ShieldAlert,
  History,
  UserX,
  Play,
  Loader2,
  Check
} from 'lucide-react';

interface ScenarioCardProps {
  scenario: ScenarioMetadata;
  isRunning: boolean;
  onRun: (scenarioId: string) => Promise<void>;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, isRunning, onRun }) => {
  const [justCompleted, setJustCompleted] = useState(false);

  // Icon mapping
  const iconMap: Record<string, React.ReactNode> = {
    Network: <Network className="w-5 h-5 text-indigo-400" />,
    LogIn: <LogIn className="w-5 h-5 text-cyan-400" />,
    HelpCircle: <HelpCircle className="w-5 h-5 text-amber-400" />,
    AlertTriangle: <AlertTriangle className="w-5 h-5 text-rose-400" />,
    ShoppingCart: <ShoppingCart className="w-5 h-5 text-emerald-400" />,
    CreditCard: <CreditCard className="w-5 h-5 text-rose-400" />,
    PhoneCall: <PhoneCall className="w-5 h-5 text-amber-400" />,
    RotateCcw: <RotateCcw className="w-5 h-5 text-orange-400" />,
    Users: <Users className="w-5 h-5 text-purple-400" />,
    Smartphone: <Smartphone className="w-5 h-5 text-blue-400" />,
    Store: <Store className="w-5 h-5 text-emerald-400" />,
    Tablet: <Tablet className="w-5 h-5 text-violet-400" />,
    ShieldAlert: <ShieldAlert className="w-5 h-5 text-gray-400" />,
    History: <History className="w-5 h-5 text-indigo-400" />,
    UserX: <UserX className="w-5 h-5 text-rose-400" />
  };

  const handleRun = async () => {
    if (isRunning) return;
    try {
      await onRun(scenario.id);
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 2500);
    } catch {
      // Handled in parent toast
    }
  };

  const categoryLabels = {
    identity: { label: 'IDENTITY', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
    journey: { label: 'JOURNEY', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
    channels: { label: 'CHANNEL', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' }
  };

  const catStyle = categoryLabels[scenario.category] || categoryLabels.identity;

  return (
    <div className="flex flex-col justify-between p-5 rounded-xl border border-gray-800/90 bg-gray-900/60 hover:bg-gray-900/90 hover:border-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-black/30 group">
      <div>
        {/* Card Header: Icon, Category & Events Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-gray-800/90 border border-gray-700/80 group-hover:scale-105 transition-transform">
              {iconMap[scenario.iconName] || <Network className="w-5 h-5 text-indigo-400" />}
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${catStyle.color}`}>
              {catStyle.label}
            </span>
          </div>

          <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono text-[11px] font-semibold">
            {scenario.expectedEvents} events
          </span>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
          {scenario.name}
        </h4>

        {/* Description */}
        <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
          {scenario.description}
        </p>

        {/* Customer Badge if present */}
        {scenario.customer && (
          <div className="mt-2 text-[11px] font-mono text-gray-400">
            <span className="text-gray-500">Customer: </span>
            <span className="text-gray-300 font-semibold">{scenario.customer.name}</span>
            {scenario.customer.id && <span className="text-gray-500"> ({scenario.customer.id})</span>}
          </div>
        )}

        {/* Channels Involved */}
        <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
          {scenario.channels.map((ch) => (
            <ChannelBadge key={ch} channel={ch} size="sm" />
          ))}
        </div>
      </div>

      {/* Footer: Action Button */}
      <div className="mt-5 pt-3.5 border-t border-gray-800/60">
        <button
          onClick={handleRun}
          disabled={isRunning}
          className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm ${
            isRunning
              ? 'bg-indigo-600/50 text-indigo-200 cursor-not-allowed border border-indigo-500/30'
              : justCompleted
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-indigo-500/20 hover:shadow-indigo-500/40 active:scale-[0.98]'
          }`}
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Generating...</span>
            </>
          ) : justCompleted ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Scenario Complete</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Scenario</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
