import React, { useState } from 'react';
import { SimulatorEvent } from '../../shared/types';
import { ChannelBadge, IdentityBadge } from './StatusBadge';
import { X, Copy, Check, Code, Hash, Clock, ShieldCheck, Database } from 'lucide-react';

interface EventDetailsDrawerProps {
  event: SimulatorEvent | null;
  onClose: () => void;
}

export const EventDetailsDrawer: React.FC<EventDetailsDrawerProps> = ({ event, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [showRawJson, setShowRawJson] = useState(true);

  if (!event) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(event, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fields = [
    { label: 'Event ID', value: event.event_id, isMono: true, highlight: true },
    { label: 'Timestamp (ISO)', value: event.timestamp, isMono: true },
    { label: 'Channel', value: event.channel, isCustom: true },
    { label: 'Event Type', value: event.event_type, isMono: true },
    { label: 'Session ID', value: event.session_id || 'null', isMono: true },
    { label: 'Anonymous ID', value: event.anonymous_id || 'null', isMono: true },
    { label: 'User ID', value: event.user_id || 'null', isMono: true },
    { label: 'Customer ID', value: event.customer_id || 'null', isMono: true, isCust: true },
    { label: 'Email', value: event.email || 'null', isMono: true },
    { label: 'Phone', value: event.phone || 'null', isMono: true },
    { label: 'Order ID', value: event.order_id || 'null', isMono: true },
    { label: 'Case ID', value: event.case_id || 'null', isMono: true },
    { label: 'Device ID', value: event.device_id || 'null', isMono: true },
    { label: 'Account ID', value: event.account_id || 'null', isMono: true },
    { label: 'Loyalty ID', value: event.loyalty_id || 'null', isMono: true },
    { label: 'Scenario ID', value: event.scenario_id || 'null', isMono: true },
    { label: 'Identity Status', value: event.identity_status || 'UNRESOLVED', isStatus: true }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end transition-opacity">
      <div
        className="w-full max-w-xl bg-[#0F172A] border-l border-gray-800 h-full shadow-2xl flex flex-col transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-gray-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-mono font-bold text-white tracking-tight">{event.event_id}</h3>
                <IdentityBadge status={event.identity_status} size="sm" />
              </div>
              <span className="text-xs text-gray-400 font-mono flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                {event.timestamp}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-medium text-gray-200 border border-gray-700 transition-colors"
              title="Copy event payload"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Key Attributes Grid */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
                Extracted Identity & Event Attributes
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {fields.map((f, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-gray-900/80 border border-gray-800/80 flex flex-col justify-between"
                >
                  <span className="text-[10px] uppercase font-mono text-gray-500 font-semibold mb-1">
                    {f.label}
                  </span>
                  {f.isCustom ? (
                    <ChannelBadge channel={event.channel} size="sm" />
                  ) : f.isStatus ? (
                    <IdentityBadge status={event.identity_status} size="sm" />
                  ) : (
                    <span
                      className={`truncate ${f.isMono ? 'font-mono' : ''} ${
                        f.highlight
                          ? 'text-indigo-400 font-bold'
                          : f.isCust && f.value !== 'null'
                          ? 'text-emerald-400 font-bold'
                          : f.value === 'null'
                          ? 'text-gray-600'
                          : 'text-gray-200 font-medium'
                      }`}
                    >
                      {f.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contextual payload data */}
          {event.data && Object.keys(event.data).length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
                  Custom Event Data Payload (data)
                </h4>
              </div>
              <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-800 font-mono text-xs text-cyan-300 overflow-x-auto">
                <pre>{JSON.stringify(event.data, null, 2)}</pre>
              </div>
            </div>
          )}

          {/* Candidates if ambiguity / conflict */}
          {event.candidates && event.candidates.length > 0 && (
            <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20">
              <span className="text-[11px] font-mono text-amber-400 font-bold block mb-1.5 uppercase">
                Identity Resolution Candidates
              </span>
              <ul className="list-disc list-inside text-xs font-mono text-amber-200 space-y-1">
                {event.candidates.map((cand, idx) => (
                  <li key={idx}>{cand}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Expandable Raw Event JSON */}
          <div className="border border-gray-800 rounded-xl overflow-hidden bg-gray-950">
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="w-full px-4 py-3 bg-gray-900/90 hover:bg-gray-800 text-left text-xs font-mono font-semibold text-gray-300 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-400" />
                <span>Raw Event JSON (Full Schema)</span>
              </div>
              <span className="text-[11px] text-gray-500">{showRawJson ? 'Hide' : 'Expand'}</span>
            </button>

            {showRawJson && (
              <div className="p-4 text-xs font-mono text-gray-300 overflow-x-auto max-h-72">
                <pre>{JSON.stringify(event, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
