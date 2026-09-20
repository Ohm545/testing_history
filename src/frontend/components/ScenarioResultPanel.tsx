import React from 'react';
import { ScenarioResult } from '../../shared/types';
import { CheckCircle2, AlertTriangle, Info, Sparkles, X, ChevronDown, ChevronUp } from 'lucide-react';
import { IdentityGraph } from './IdentityGraph';

interface ScenarioResultPanelProps {
  result: ScenarioResult;
  onDismiss: () => void;
  onScrollToEvents: () => void;
}

export const ScenarioResultPanel: React.FC<ScenarioResultPanelProps> = ({
  result,
  onDismiss,
  onScrollToEvents
}) => {
  const [expanded, setExpanded] = React.useState(true);

  return (
    <div className="mb-8 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#0F172A] via-[#0B0F19] to-[#131B2E] p-5 lg:p-6 shadow-2xl shadow-indigo-950/40 relative overflow-hidden transition-all">
      {/* Decorative gradient orb */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 uppercase">
                SCENARIO COMPLETED
              </span>
              <span className="text-gray-600">•</span>
              <span className="text-xs font-mono text-gray-400">{result.eventsGenerated} events generated & ingested</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">{result.name}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Pattern Badge */}
          <div className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold tracking-wider">
            PATTERN: {result.detectedPattern}
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            title={expanded ? 'Collapse panel' : 'Expand panel'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <button
            onClick={onDismiss}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            title="Dismiss result"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-1">
          {/* Checklist & Explanation Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Checklist Column */}
            <div className="lg:col-span-5 space-y-2.5">
              <span className="text-[11px] font-mono font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                Execution Verification Steps
              </span>
              <div className="space-y-2">
                {result.checklist.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg bg-gray-900/60 border border-gray-800/80 text-xs"
                  >
                    {item.status === 'checked' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : item.status === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    )}
                    <span className={item.status === 'warning' ? 'text-amber-200 font-medium' : 'text-gray-300'}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={onScrollToEvents}
                  className="w-full py-2 px-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 hover:text-white transition-colors border border-gray-700 flex items-center justify-center gap-2"
                >
                  <span>Inspect Ingested Events in Table ↓</span>
                </button>
              </div>
            </div>

            {/* Explanation & Insight Column */}
            <div className="lg:col-span-7 flex flex-col justify-between bg-gray-900/40 p-4 rounded-xl border border-gray-800">
              <div>
                <span className="text-[11px] font-mono font-semibold text-indigo-400 uppercase tracking-wider block mb-2">
                  Scenario Intelligence Insight
                </span>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {result.explanation}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400 font-mono">
                <span>Ingestion Pipeline: <span className="text-emerald-400 font-semibold">POST /events</span></span>
                <span>Audit Trail: <span className="text-cyan-400 font-semibold">Verified</span></span>
              </div>
            </div>
          </div>

          {/* Identity Graph Component */}
          <IdentityGraph result={result} />
        </div>
      )}
    </div>
  );
};
