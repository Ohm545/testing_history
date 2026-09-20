import React from 'react';
import { SimulatorEvent } from '../../shared/types';
import { ChannelBadge, IdentityBadge } from './StatusBadge';
import { Play, Eye, Clock, Terminal } from 'lucide-react';

interface EventTableProps {
  events: SimulatorEvent[];
  onSelectEvent: (event: SimulatorEvent) => void;
  onRunFirstScenario: () => void;
}

export const EventTable: React.FC<EventTableProps> = ({
  events,
  onSelectEvent,
  onRunFirstScenario
}) => {
  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return iso;
    }
  };

  const formatEventType = (type: string) => {
    return type.replace(/_/g, ' ');
  };

  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center my-6 shadow-xs">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
          <Terminal className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">No events yet</h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto mt-1 mb-6">
          Run a demo scenario to generate customer interaction events.
        </p>
        <button
          onClick={onRunFirstScenario}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all active:scale-95"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Run First Scenario</span>
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-xs font-mono font-bold tracking-wider text-slate-700 uppercase">
            Live Ingested Event Log Stream
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-500">
          Showing <strong className="text-slate-900">{events.length}</strong> events (Click row to inspect)
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-mono text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4">Event ID</th>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4">Channel</th>
              <th className="py-3 px-4">Event Type</th>
              <th className="py-3 px-4">Session</th>
              <th className="py-3 px-4">Anonymous ID</th>
              <th className="py-3 px-4">User ID</th>
              <th className="py-3 px-4">Customer ID</th>
              <th className="py-3 px-4">Identity Status</th>
              <th className="py-3 px-3 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {events.map((evt) => (
              <tr
                key={evt.event_id}
                onClick={() => onSelectEvent(evt)}
                className="hover:bg-indigo-50/50 cursor-pointer transition-colors group"
              >
                {/* Event ID */}
                <td className="py-3 px-4 font-bold text-indigo-600 group-hover:text-indigo-800 whitespace-nowrap">
                  {evt.event_id}
                </td>

                {/* Time */}
                <td className="py-3 px-4 text-slate-500 whitespace-nowrap" title={evt.timestamp}>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {formatTime(evt.timestamp)}
                  </span>
                </td>

                {/* Channel */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <ChannelBadge channel={evt.channel} size="sm" />
                </td>

                {/* Event Type */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 font-sans capitalize font-medium text-[11px]">
                    {formatEventType(evt.event_type)}
                  </span>
                </td>

                {/* Session ID */}
                <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                  {evt.session_id ? (
                    <span className="text-slate-800">{evt.session_id}</span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>

                {/* Anonymous ID */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {evt.anonymous_id ? (
                    <span className="text-purple-700 font-semibold">{evt.anonymous_id}</span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>

                {/* User ID */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {evt.user_id ? (
                    <span className="text-cyan-700 font-semibold">{evt.user_id}</span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>

                {/* Customer ID */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {evt.customer_id ? (
                    <span className="text-emerald-700 font-bold">{evt.customer_id}</span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>

                {/* Identity Status */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <IdentityBadge status={evt.identity_status} size="sm" />
                </td>

                {/* Action Icon */}
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEvent(evt);
                    }}
                    className="p-1 rounded text-slate-400 group-hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
