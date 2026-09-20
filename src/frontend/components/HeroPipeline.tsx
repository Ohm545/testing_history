import React from 'react';
import { MousePointerClick, Cpu, Send, GitMerge, LineChart, ChevronRight } from 'lucide-react';

export const HeroPipeline: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: 'Customer Interaction',
      subtitle: 'Web, Mobile, Store, IVR',
      icon: <MousePointerClick className="w-5 h-5 text-blue-600" />,
      color: 'from-blue-50 to-white border-blue-200'
    },
    {
      step: 2,
      title: 'Event Generated',
      subtitle: 'Structured JSON Payload',
      icon: <Cpu className="w-5 h-5 text-indigo-600" />,
      color: 'from-indigo-50 to-white border-indigo-200'
    },
    {
      step: 3,
      title: 'POST /events',
      subtitle: 'Ingestion Pipeline & Store',
      icon: <Send className="w-5 h-5 text-cyan-600" />,
      color: 'from-cyan-50 to-white border-cyan-200'
    },
    {
      step: 4,
      title: 'Identity Resolution',
      subtitle: 'Graph & Ambiguity Stitches',
      icon: <GitMerge className="w-5 h-5 text-amber-600" />,
      color: 'from-amber-50 to-white border-amber-200'
    },
    {
      step: 5,
      title: 'Journey Intelligence',
      subtitle: 'Drop-off & Churn Patterns',
      icon: <LineChart className="w-5 h-5 text-emerald-600" />,
      color: 'from-emerald-50 to-white border-emerald-200'
    }
  ];

  return (
    <section className="mb-8 pt-2">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Synthetic Event Source</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span>Hackathon Demonstration Platform</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
            Simulate Customer Journeys
          </h2>
          <p className="text-slate-600 text-sm lg:text-base mt-1.5 max-w-2xl leading-relaxed">
            Generate realistic cross-channel customer events and send them to the identity resolution platform.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-white px-3.5 py-2 rounded-lg border border-slate-200 shadow-sm shrink-0">
          <span className="text-emerald-600 font-bold">MODE:</span>
          <span>In-Memory Controlled Simulator</span>
        </div>
      </div>

      {/* Visual Pipeline */}
      <div className="mt-6 pt-2">
        <div className="text-xs font-mono font-semibold tracking-wider text-slate-500 uppercase mb-3 flex items-center gap-2">
          <span>Simulation Architecture Pipeline</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 relative">
          {steps.map((s, idx) => (
            <div key={s.step} className="flex items-center gap-2 relative">
              <div className={`w-full flex items-center gap-3 p-3.5 rounded-xl border bg-gradient-to-br ${s.color} shadow-sm transition-all hover:border-indigo-300 hover:shadow-md group`}>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  {s.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-400 font-bold">0{s.step}</span>
                    <h3 className="font-semibold text-xs tracking-tight text-slate-900 truncate">{s.title}</h3>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{s.subtitle}</p>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:flex items-center justify-center text-slate-400 -mr-3 z-10">
                  <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
