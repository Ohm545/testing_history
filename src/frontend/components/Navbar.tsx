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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 lg:px-8 py-4 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Brand info */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-md shadow-indigo-500/20 border border-indigo-400/30">
              <Sparkles className="w-5 h-5 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping opacity-75" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-800 bg-clip-text text-transparent">
                  JourneyFlow
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full">
                  SIMULATOR
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Customer Event Simulator</p>
            </div>
          </div>

          {/* Mobile status indicator */}
          <div className="flex md:hidden items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                apiConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
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
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
                  : 'bg-rose-50 text-rose-700 border-rose-200 shadow-sm'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`} />
              <span>{apiConnected ? '● API Connected' : '● API Disconnected'}</span>
            </div>
          </div>

          {/* Event Count Counter */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono shadow-sm">
            <Activity className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-slate-500 font-medium">Events:</span>
            <span className="font-bold text-slate-900 text-sm">{eventCount}</span>
          </div>

          {/* Manual Single Event Button */}
          <button
            onClick={onOpenCustomEvent}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg text-xs font-medium transition-all shadow-sm hover:border-slate-400 active:scale-95"
            title="Create and send a custom synthetic event"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-600" />
            <span>Custom Event</span>
          </button>

          {/* Bulk Batch Generator Button */}
          <button
            onClick={onOpenBulkModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg text-xs font-medium transition-all shadow-sm hover:border-slate-400 active:scale-95"
            title="Batch generate synthetic events"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-600" />
            <span>Batch (10-100)</span>
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={onOpenReset}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 hover:border-rose-300 rounded-lg text-xs font-semibold transition-all shadow-sm active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
