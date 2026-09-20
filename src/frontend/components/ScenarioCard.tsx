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

  const iconMap: Record<string, React.ReactNode> = {
    Network: <Network className="w-5 h-5 text-indigo-600" />,
    LogIn: <LogIn className="w-5 h-5 text-cyan-600" />,
    HelpCircle: <HelpCircle className="w-5 h-5 text-amber-600" />,
    AlertTriangle: <AlertTriangle className="w-5 h-5 text-rose-600" />,
    ShoppingCart: <ShoppingCart className="w-5 h-5 text-emerald-600" />,
    CreditCard: <CreditCard className="w-5 h-5 text-rose-600" />,
    PhoneCall: <PhoneCall className="w-5 h-5 text-amber-600" />,
    RotateCcw: <RotateCcw className="w-5 h-5 text-orange-600" />,
    Users: <Users className="w-5 h-5 text-purple-600" />,
    Smartphone: <Smartphone className="w-5 h-5 text-blue-600" />,
    Store: <Store className="w-5 h-5 text-emerald-600" />,
    Tablet: <Tablet className="w-5 h-5 text-violet-600" />,
    ShieldAlert: <ShieldAlert className="w-5 h-5 text-slate-500" />,
    History: <History className="w-5 h-5 text-indigo-600" />,
    UserX: <UserX className="w-5 h-5 text-rose-600" />
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
    identity: { label: 'IDENTITY', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    journey: { label: 'JOURNEY', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    channels: { label: 'CHANNEL', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
  };

  const catStyle = categoryLabels[scenario.category] || categoryLabels.identity;

  return (
    <div className="flex flex-col justify-between p-5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-lg transition-all duration-200 shadow-xs group">
      <div>
        {/* Card Header: Icon, Category & Events Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 group-hover:scale-105 transition-transform shadow-2xs">
              {iconMap[scenario.iconName] || <Network className="w-5 h-5 text-indigo-600" />}
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${catStyle.color}`}>
              {catStyle.label}
            </span>
          </div>

          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[11px] font-semibold border border-slate-200">
            {scenario.expectedEvents} events
          </span>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
          {scenario.name}
        </h4>

        {/* Description */}
        <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
          {scenario.description}
        </p>

        {/* Customer Badge if present */}
        {scenario.customer && (
          <div className="mt-2 text-[11px] font-mono text-slate-500">
            <span className="text-slate-400">Customer: </span>
            <span className="text-slate-800 font-semibold">{scenario.customer.name}</span>
            {scenario.customer.id && <span className="text-slate-400"> ({scenario.customer.id})</span>}
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
      <div className="mt-5 pt-3.5 border-t border-slate-100">
        <button
          onClick={handleRun}
          disabled={isRunning}
          className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-xs ${
            isRunning
              ? 'bg-indigo-100 text-indigo-500 cursor-not-allowed border border-indigo-200'
              : justCompleted
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
              : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-indigo-600/20 hover:shadow-md active:scale-[0.98]'
          }`}
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>Generating...</span>
            </>
          ) : justCompleted ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
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
