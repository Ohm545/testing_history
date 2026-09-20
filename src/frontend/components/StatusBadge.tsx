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
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      icon: <CheckCircle className="w-3.5 h-3.5" />
    },
    UNRESOLVED: {
      bg: 'bg-gray-500/10',
      text: 'text-gray-400',
      border: 'border-gray-500/30',
      icon: <HelpCircle className="w-3.5 h-3.5" />
    },
    AMBIGUOUS: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      icon: <AlertCircle className="w-3.5 h-3.5" />
    },
    CONFLICT: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      icon: <XCircle className="w-3.5 h-3.5" />
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
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      icon: <Globe className="w-3.5 h-3.5" />
    },
    mobile_app: {
      label: 'MOBILE APP',
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/30',
      icon: <Smartphone className="w-3.5 h-3.5" />
    },
    call_center: {
      label: 'CALL CENTER',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      icon: <PhoneCall className="w-3.5 h-3.5" />
    },
    physical_store: {
      label: 'STORE',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      icon: <Store className="w-3.5 h-3.5" />
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
