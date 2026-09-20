import React, { useState } from 'react';
import { ScenarioMetadata, ScenarioCategory } from '../../shared/types';
import { ScenarioCard } from './ScenarioCard';
import { Layers, Fingerprint, LineChart, Radio } from 'lucide-react';

interface ScenarioSectionProps {
  scenarios: ScenarioMetadata[];
  runningScenarioId: string | null;
  onRunScenario: (id: string) => Promise<void>;
}

export const ScenarioSection: React.FC<ScenarioSectionProps> = ({
  scenarios,
  runningScenarioId,
  onRunScenario
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | ScenarioCategory>('all');

  const categories = [
    { id: 'all', label: 'All Scenarios', count: scenarios.length, icon: <Layers className="w-3.5 h-3.5" /> },
    {
      id: 'identity',
      label: 'Identity Resolution',
      count: scenarios.filter(s => s.category === 'identity').length,
      icon: <Fingerprint className="w-3.5 h-3.5" />
    },
    {
      id: 'journey',
      label: 'Journey Intelligence',
      count: scenarios.filter(s => s.category === 'journey').length,
      icon: <LineChart className="w-3.5 h-3.5" />
    },
    {
      id: 'channels',
      label: 'Channel Journeys',
      count: scenarios.filter(s => s.category === 'channels').length,
      icon: <Radio className="w-3.5 h-3.5" />
    }
  ];

  const filtered = activeCategory === 'all'
    ? scenarios
    : scenarios.filter(s => s.category === activeCategory);

  return (
    <section className="mb-10" id="scenarios-section">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">Demo Scenarios</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              15 Preconfigured
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Choose a scenario to generate a realistic sequence of customer events.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-xs overflow-x-auto max-w-full">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <ScenarioCard
            key={s.id}
            scenario={s}
            isRunning={runningScenarioId === s.id}
            onRun={onRunScenario}
          />
        ))}
      </div>
    </section>
  );
};
