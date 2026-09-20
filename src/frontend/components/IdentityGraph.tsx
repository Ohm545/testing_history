import React from 'react';
import { ScenarioResult } from '../../shared/types';
import { ArrowDown, GitBranch, AlertCircle, XCircle, CheckCircle, HelpCircle } from 'lucide-react';

interface IdentityGraphProps {
  result: ScenarioResult;
}

export const IdentityGraph: React.FC<IdentityGraphProps> = ({ result }) => {
  const { scenarioId, identityStatus } = result;

  // Render scenario-specific dedicated identity graphs
  return (
    <div className="mt-4 p-5 rounded-xl border border-gray-800 bg-[#070B14] shadow-inner">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800/80">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-mono font-bold tracking-wider text-gray-300 uppercase">
            Identity Resolution Graph Visualization
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-500 font-mono">Status:</span>
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase border ${
              identityStatus === 'RESOLVED'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : identityStatus === 'AMBIGUOUS'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : identityStatus === 'CONFLICT'
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : 'bg-gray-500/10 text-gray-400 border-gray-500/30'
            }`}
          >
            {identityStatus}
          </span>
        </div>
      </div>

      {/* 1. Cross Channel Linear */}
      {scenarioId === 'identity-resolution' && (
        <div className="flex flex-col items-center py-3">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-8 w-full max-w-2xl">
            {/* Step 1: Cookie */}
            <div className="flex flex-col items-center">
              <div className="px-4 py-2.5 rounded-xl bg-blue-950/40 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold shadow-lg shadow-blue-500/10 text-center">
                <span className="text-[10px] text-blue-400 block font-sans uppercase">Browser Cookie</span>
                ANON-WEB-1001
              </div>
            </div>

            <div className="flex items-center justify-center text-gray-500">
              <span className="text-xs font-mono font-semibold text-indigo-400 px-2 py-1 bg-indigo-500/10 rounded border border-indigo-500/20">
                Auth Login →
              </span>
            </div>

            {/* Step 2: User Account */}
            <div className="flex flex-col items-center">
              <div className="px-4 py-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-indigo-300 text-xs font-mono font-bold shadow-lg shadow-indigo-500/10 text-center">
                <span className="text-[10px] text-indigo-400 block font-sans uppercase">User Profile</span>
                U-1001
              </div>
            </div>

            <div className="flex items-center justify-center text-gray-500">
              <span className="text-xs font-mono font-semibold text-emerald-400 px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/20">
                Stitched →
              </span>
            </div>

            {/* Step 3: Enterprise Customer */}
            <div className="flex flex-col items-center">
              <div className="px-4 py-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold shadow-lg shadow-emerald-500/10 text-center">
                <span className="text-[10px] text-emerald-400 block font-sans uppercase">Master Customer</span>
                CUST-1001
                <span className="text-[10px] text-gray-400 block font-sans">Rahul Sharma</span>
              </div>
            </div>
          </div>

          {/* Secondary links (Mobile & Call Center) */}
          <div className="mt-5 pt-4 border-t border-gray-800/60 w-full max-w-xl flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-gray-300">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/30 border border-purple-500/30 text-purple-300">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>DEV-MOB-1001</span>
              <span className="text-gray-500">→</span>
              <span className="text-emerald-400 font-bold">CUST-1001</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Phone 9876500001</span>
              <span className="text-gray-500">→</span>
              <span className="text-emerald-400 font-bold">CUST-1001</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Shared Browser Scenario */}
      {scenarioId === 'shared-browser' && (
        <div className="py-2 flex flex-col items-center">
          <div className="w-full max-w-lg">
            {/* Root Anonymous Cookie */}
            <div className="flex justify-center mb-4">
              <div className="px-5 py-2.5 rounded-xl bg-purple-950/40 border border-purple-500/50 text-purple-300 text-xs font-mono font-bold shadow-md text-center">
                <span className="text-[10px] text-purple-400 block font-sans uppercase">Shared Browser Cookie</span>
                ANON-SHARED-01
              </div>
            </div>

            {/* Split branches */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Branch 1 */}
              <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-950/20 flex flex-col items-center text-center">
                <span className="text-[10px] font-mono text-blue-400 font-semibold uppercase mb-1">Session 1</span>
                <span className="text-xs font-mono text-gray-300 mb-2">SES-SHARED-01</span>
                <ArrowDown className="w-3.5 h-3.5 text-blue-400 mb-2" />
                <span className="text-xs font-mono text-gray-400">User: U-1013</span>
                <div className="mt-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono">
                  CUST-1013 (Aarav Patel)
                </div>
              </div>

              {/* Branch 2 */}
              <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20 flex flex-col items-center text-center">
                <span className="text-[10px] font-mono text-amber-400 font-semibold uppercase mb-1">Session 2</span>
                <span className="text-xs font-mono text-gray-300 mb-2">SES-SHARED-02</span>
                <ArrowDown className="w-3.5 h-3.5 text-amber-400 mb-2" />
                <span className="text-xs font-mono text-gray-400">User: U-1014</span>
                <div className="mt-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono">
                  CUST-1014 (Sneha Verma)
                </div>
              </div>
            </div>

            <div className="mt-4 p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-[11px] text-gray-400 text-center">
              ✓ Prevents false consolidation: One anonymous device cookie safely branches into two distinct customer profiles via session boundary.
            </div>
          </div>
        </div>
      )}

      {/* 3. Ambiguous Identity Scenario */}
      {scenarioId === 'identity-ambiguity' && (
        <div className="py-2 flex flex-col items-center">
          <div className="w-full max-w-lg">
            {/* Root Weak Evidence */}
            <div className="flex justify-center mb-3">
              <div className="px-5 py-2.5 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold shadow-md text-center">
                <span className="text-[10px] text-amber-400 block font-sans uppercase">Weak Identifier (No Phone / Email)</span>
                Name: "Amit Patel"
              </div>
            </div>

            <div className="flex justify-center mb-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-mono flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Confidence: LOW (50% Split) — Status: AMBIGUOUS
              </span>
            </div>

            {/* Split Candidates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl border border-dashed border-amber-500/40 bg-gray-900/60 flex flex-col items-center text-center">
                <span className="text-[10px] font-mono text-gray-400 uppercase mb-1">Eligible Candidate 1</span>
                <span className="text-xs font-mono font-bold text-gray-200">CUST-1003</span>
                <span className="text-xs text-gray-400 mt-0.5">Amit Patel (Mumbai)</span>
                <span className="text-[10px] font-mono text-amber-400 mt-2 px-2 py-0.5 rounded bg-amber-500/10">Match: 50%</span>
              </div>

              <div className="p-3.5 rounded-xl border border-dashed border-amber-500/40 bg-gray-900/60 flex flex-col items-center text-center">
                <span className="text-[10px] font-mono text-gray-400 uppercase mb-1">Eligible Candidate 2</span>
                <span className="text-xs font-mono font-bold text-gray-200">CUST-1004</span>
                <span className="text-xs text-gray-400 mt-0.5">Amit Patel (Ahmedabad)</span>
                <span className="text-[10px] font-mono text-amber-400 mt-2 px-2 py-0.5 rounded bg-amber-500/10">Match: 50%</span>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-amber-300/80 text-center font-mono">
              ⚠ System explicitly refused to auto-pick or merge records without verifying phone or account credentials.
            </p>
          </div>
        </div>
      )}

      {/* 4. Identity Conflict Scenario */}
      {scenarioId === 'identity-conflict' && (
        <div className="py-2 flex flex-col items-center">
          <div className="w-full max-w-lg">
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono mb-4 text-center flex items-center justify-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Contradictory Evidence in Single Call Event</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Evidence 1 */}
              <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-950/20 flex flex-col items-center text-center">
                <span className="text-[10px] font-mono text-rose-400 uppercase mb-1">Evidence Source A</span>
                <div className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-xs font-mono text-white mb-2">
                  Phone: 9876500010
                </div>
                <ArrowDown className="w-3.5 h-3.5 text-rose-400 mb-2" />
                <span className="text-[10px] text-gray-400 uppercase">Resolves to</span>
                <span className="text-xs font-mono font-bold text-emerald-400">CUST-1005</span>
                <span className="text-xs text-gray-300">Priya Nair</span>
              </div>

              {/* Evidence 2 */}
              <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-950/20 flex flex-col items-center text-center">
                <span className="text-[10px] font-mono text-rose-400 uppercase mb-1">Evidence Source B</span>
                <div className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-xs font-mono text-white mb-2">
                  Order ID: ORD-9001
                </div>
                <ArrowDown className="w-3.5 h-3.5 text-rose-400 mb-2" />
                <span className="text-[10px] text-gray-400 uppercase">Resolves to</span>
                <span className="text-xs font-mono font-bold text-cyan-400">CUST-1006</span>
                <span className="text-xs text-gray-300">Vikram Mehta</span>
              </div>
            </div>

            <div className="mt-4 p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-[11px] text-gray-300 text-center font-mono">
              Status: <span className="text-rose-400 font-bold">CONFLICT</span> — Both evidence streams preserved without overwriting either customer record.
            </div>
          </div>
        </div>
      )}

      {/* 5. Multiple Phone Numbers */}
      {scenarioId === 'multiple-phone' && (
        <div className="py-2 flex flex-col items-center">
          <div className="w-full max-w-md">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-3 rounded-xl border border-blue-500/30 bg-blue-950/20 text-center">
                <span className="text-[10px] text-blue-400 block font-mono uppercase">Primary Phone</span>
                <span className="text-xs font-mono font-bold text-white">+91 9876500015</span>
              </div>
              <div className="p-3 rounded-xl border border-purple-500/30 bg-purple-950/20 text-center">
                <span className="text-[10px] text-purple-400 block font-mono uppercase">Secondary Phone</span>
                <span className="text-xs font-mono font-bold text-white">+91 9876500099</span>
              </div>
            </div>

            <div className="flex justify-center my-2">
              <span className="text-xs font-mono text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Both Identifiers Converge
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-center">
              <span className="text-[10px] text-emerald-400 block font-mono uppercase">Unified Customer Record</span>
              <span className="text-sm font-mono font-bold text-white">CUST-1015</span>
              <span className="text-xs text-gray-300 block">Rohan Gupta</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. Unresolved Scenario */}
      {scenarioId === 'unresolved' && (
        <div className="py-2 flex flex-col items-center">
          <div className="w-full max-w-md p-4 rounded-xl border border-gray-700 bg-gray-900/80 text-center">
            <HelpCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <span className="text-xs font-mono text-gray-300 block font-semibold mb-1">
              ANON-UNKNOWN-999 / DEV-UNKNOWN
            </span>
            <p className="text-xs text-gray-400 max-w-xs mx-auto mb-3">
              Zero verifiable identifiers (no customer_id, user_id, email, phone, or order).
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-300 text-xs font-mono font-semibold">
              Status: UNRESOLVED (No Hallucinated Assignment)
            </div>
          </div>
        </div>
      )}

      {/* 7. Generic / Journey Flow Visualizer for other scenarios */}
      {scenarioId !== 'identity-resolution' &&
        scenarioId !== 'shared-browser' &&
        scenarioId !== 'identity-ambiguity' &&
        scenarioId !== 'identity-conflict' &&
        scenarioId !== 'multiple-phone' &&
        scenarioId !== 'unresolved' &&
        result.graphNodes && (
          <div className="py-2 flex flex-col items-center">
            <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-3xl">
              {result.graphNodes.map((node, i) => (
                <React.Fragment key={node.id}>
                  <div
                    className={`px-3.5 py-2 rounded-xl border text-center font-mono shadow-sm ${
                      node.type === 'cust'
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : node.type === 'conflict'
                        ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                        : node.type === 'ambiguous'
                        ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                        : 'bg-gray-900 border-gray-800 text-gray-200'
                    }`}
                  >
                    <span className="text-xs font-bold block">{node.label}</span>
                    {node.subtitle && (
                      <span className="text-[10px] text-gray-400 block">{node.subtitle}</span>
                    )}
                  </div>

                  {i < (result.graphNodes?.length || 0) - 1 && (
                    <span className="text-gray-600 font-mono text-sm">➔</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};
