import React from 'react';
import { Activity, RotateCcw, Plus, Layers, Sparkles } from 'lucide-react';

interface NavbarProps {
  apiConnected: boolean;
  eventCount: number;
  onOpenReset: () => void;
  onOpenCustomEvent: () => void;
  onOpenBulkModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  apiConnected,
  eventCount,
  onOpenReset,
  onOpenCustomEvent,
  onOpenBulkModal
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800/80 bg-[#0B0F19]/90 backdrop-blur-md px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Brand info */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-lg shadow-indigo-500/25 border border-indigo-400/30">
              <Sparkles className="w-5 h-5 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping opacity-75" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-indigo-200 bg-clip-text text-transparent">
                  JourneyFlow
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                  SIMULATOR
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium">Customer Event Simulator</p>
            </div>
          </div>

          {/* Mobile status indicator */}
          <div className="flex md:hidden items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                apiConnected
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
              {apiConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Center/Right Status, Event Counter & Actions */}
        <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">
          {/* API Status Badge (Desktop) */}
          <div className="hidden md:flex items-center">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold tracking-wide transition-colors ${
                apiConnected
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-sm shadow-rose-500/10'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
              <span>{apiConnected ? '● API Connected' : '● API Disconnected'}</span>
            </div>
          </div>

          {/* Event Count Counter */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-gray-900/90 border border-gray-800 rounded-lg text-xs font-mono">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-gray-400">Events:</span>
            <span className="font-bold text-white text-sm">{eventCount}</span>
          </div>

          {/* Manual Single Event Button */}
          <button
            onClick={onOpenCustomEvent}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/90 hover:bg-gray-700/90 text-gray-200 hover:text-white border border-gray-700 rounded-lg text-xs font-medium transition-all shadow-sm hover:border-gray-600"
            title="Create and send a custom synthetic event"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span>Custom Event</span>
          </button>

          {/* Bulk Batch Generator Button */}
          <button
            onClick={onOpenBulkModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/90 hover:bg-gray-700/90 text-gray-200 hover:text-white border border-gray-700 rounded-lg text-xs font-medium transition-all shadow-sm hover:border-gray-600"
            title="Batch generate synthetic events"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Batch (10-100)</span>
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={onOpenReset}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 hover:border-rose-500/50 rounded-lg text-xs font-semibold transition-all shadow-sm active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
