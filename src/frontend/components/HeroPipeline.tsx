import React from 'react';
import { MousePointerClick, Cpu, Send, GitMerge, LineChart, ChevronRight } from 'lucide-react';

export const HeroPipeline: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: 'Customer Interaction',
      subtitle: 'Web, Mobile, Store, IVR',
      icon: <MousePointerClick className="w-5 h-5 text-blue-400" />,
      color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30'
    },
    {
      step: 2,
      title: 'Event Generated',
      subtitle: 'Structured JSON Payload',
      icon: <Cpu className="w-5 h-5 text-indigo-400" />,
      color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30'
    },
    {
      step: 3,
      title: 'POST /events',
      subtitle: 'Ingestion Pipeline & Store',
      icon: <Send className="w-5 h-5 text-cyan-400" />,
      color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30'
    },
    {
      step: 4,
      title: 'Identity Resolution',
      subtitle: 'Graph & Ambiguity Stitches',
      icon: <GitMerge className="w-5 h-5 text-amber-400" />,
      color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30'
    },
    {
      step: 5,
      title: 'Journey Intelligence',
      subtitle: 'Drop-off & Churn Patterns',
      icon: <LineChart className="w-5 h-5 text-emerald-400" />,
      color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30'
    }
  ];

  return (
    <section className="mb-8 pt-2">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gray-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Synthetic Event Source</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>Hackathon Demonstration Platform</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Simulate Customer Journeys
          </h2>
          <p className="text-gray-400 text-sm lg:text-base mt-1.5 max-w-2xl leading-relaxed">
            Generate realistic cross-channel customer events and send them to the identity resolution platform.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 bg-gray-900/80 px-3.5 py-2 rounded-lg border border-gray-800 shrink-0">
          <span className="text-emerald-400 font-bold">MODE:</span>
          <span>In-Memory Controlled Simulator</span>
        </div>
      </div>

      {/* Visual Pipeline */}
      <div className="mt-6 pt-2">
        <div className="text-xs font-mono font-semibold tracking-wider text-gray-400 uppercase mb-3 flex items-center gap-2">
          <span>Simulation Architecture Pipeline</span>
          <div className="h-px bg-gray-800 flex-1" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 relative">
          {steps.map((s, idx) => (
            <div key={s.step} className="flex items-center gap-2 relative">
              <div className={`w-full flex items-center gap-3 p-3.5 rounded-xl border bg-gradient-to-br ${s.color} backdrop-blur-sm shadow-md transition-all hover:border-gray-600 group`}>
                <div className="p-2.5 rounded-lg bg-gray-900/90 border border-gray-800 shrink-0 group-hover:scale-105 transition-transform">
                  {s.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-gray-400 font-bold">0{s.step}</span>
                    <h3 className="font-semibold text-xs tracking-tight text-white truncate">{s.title}</h3>
                  </div>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">{s.subtitle}</p>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:flex items-center justify-center text-gray-600 -mr-3 z-10">
                  <ChevronRight className="w-4 h-4 text-indigo-400/60 shrink-0" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
