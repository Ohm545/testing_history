import React from 'react';
import { IdentityStatus, EventChannel } from '../../shared/types';
import { Globe, Smartphone, PhoneCall, Store, CheckCircle, AlertCircle, HelpCircle, XCircle } from 'lucide-react';

interface IdentityBadgeProps {
  status?: IdentityStatus;
  size?: 'sm' | 'md';
}

export const IdentityBadge: React.FC<IdentityBadgeProps> = ({ status = 'UNRESOLVED', size = 'sm' }) => {
  const configs: Record<IdentityStatus, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
    RESOLVED: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-300',
      icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
    },
    UNRESOLVED: {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-300',
      icon: <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
    },
    AMBIGUOUS: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      icon: <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
    },
    CONFLICT: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-300',
      icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />
    }
  };

  const c = configs[status] || configs.UNRESOLVED;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-mono uppercase tracking-wider ${sizeClasses} ${c.bg} ${c.text} ${c.border}`}>
      {c.icon}
      <span>{status}</span>
    </span>
  );
};

interface ChannelBadgeProps {
  channel: EventChannel;
  size?: 'sm' | 'md';
}

export const ChannelBadge: React.FC<ChannelBadgeProps> = ({ channel, size = 'sm' }) => {
  const configs: Record<EventChannel, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
    web: {
      label: 'WEB',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: <Globe className="w-3.5 h-3.5 text-blue-600" />
    },
    mobile_app: {
      label: 'MOBILE APP',
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      icon: <Smartphone className="w-3.5 h-3.5 text-purple-600" />
    },
    call_center: {
      label: 'CALL CENTER',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
    },
    physical_store: {
      label: 'STORE',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: <Store className="w-3.5 h-3.5 text-emerald-600" />
    }
  };

  const c = configs[channel] || configs.web;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border font-medium ${sizeClasses} ${c.bg} ${c.text} ${c.border}`}>
      {c.icon}
      <span>{c.label}</span>
    </span>
  );
};
