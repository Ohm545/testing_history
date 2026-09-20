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
  // Format ISO time to clean HH:mm:ss
  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return iso;
    }
  };

  // Format event type pill
  const formatEventType = (type: string) => {
    return type.replace(/_/g, ' ');
  };

  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-12 text-center my-6">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-lg shadow-indigo-500/10">
          <Terminal className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-white tracking-tight">No events yet</h3>
        <p className="text-sm text-gray-400 max-w-md mx-auto mt-1 mb-6">
          Run a demo scenario to generate customer interaction events.
        </p>
        <button
          onClick={onRunFirstScenario}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Run First Scenario</span>
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm overflow-hidden shadow-xl">
      <div className="px-5 py-3.5 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-xs font-mono font-bold tracking-wider text-gray-200 uppercase">
            Live Ingested Event Log Stream
          </h3>
        </div>
        <span className="text-xs font-mono text-gray-400">
          Showing <strong className="text-white">{events.length}</strong> events (Click row to inspect)
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-950/60 text-gray-400 font-mono text-[11px] uppercase tracking-wider">
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
          <tbody className="divide-y divide-gray-800/60 font-mono">
            {events.map((evt) => (
              <tr
                key={evt.event_id}
                onClick={() => onSelectEvent(evt)}
                className="hover:bg-indigo-950/20 cursor-pointer transition-colors group"
              >
                {/* Event ID */}
                <td className="py-3 px-4 font-bold text-indigo-400 group-hover:text-indigo-300 whitespace-nowrap">
                  {evt.event_id}
                </td>

                {/* Time */}
                <td className="py-3 px-4 text-gray-400 whitespace-nowrap" title={evt.timestamp}>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    {formatTime(evt.timestamp)}
                  </span>
                </td>

                {/* Channel */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <ChannelBadge channel={evt.channel} size="sm" />
                </td>

                {/* Event Type */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700 text-gray-200 font-sans capitalize font-medium text-[11px]">
                    {formatEventType(evt.event_type)}
                  </span>
                </td>

                {/* Session ID */}
                <td className="py-3 px-4 text-gray-400 whitespace-nowrap">
                  {evt.session_id ? (
                    <span className="text-gray-300">{evt.session_id}</span>
                  ) : (
                    <span className="text-gray-600">—</span>
                  )}
                </td>

                {/* Anonymous ID */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {evt.anonymous_id ? (
                    <span className="text-purple-300 font-semibold">{evt.anonymous_id}</span>
                  ) : (
                    <span className="text-gray-600">—</span>
                  )}
                </td>

                {/* User ID */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {evt.user_id ? (
                    <span className="text-cyan-300 font-semibold">{evt.user_id}</span>
                  ) : (
                    <span className="text-gray-600">—</span>
                  )}
                </td>

                {/* Customer ID */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {evt.customer_id ? (
                    <span className="text-emerald-400 font-bold">{evt.customer_id}</span>
                  ) : (
                    <span className="text-gray-600">—</span>
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
                    className="p-1 rounded text-gray-500 group-hover:text-indigo-400 hover:bg-gray-800 transition-colors"
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
