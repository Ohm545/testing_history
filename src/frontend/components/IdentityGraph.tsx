import React from 'react';
import { ScenarioResult } from '../../shared/types';
import { ArrowDown, GitBranch, AlertCircle, XCircle, CheckCircle, HelpCircle } from 'lucide-react';

interface IdentityGraphProps {
  result: ScenarioResult;
}

export const IdentityGraph: React.FC<IdentityGraphProps> = ({ result }) => {
  const { scenarioId, identityStatus } = result;

  return (
    <div className="mt-4 p-5 rounded-xl border border-slate-200 bg-slate-50/70 shadow-inner">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-indigo-600" />
          <h4 className="text-xs font-mono font-bold tracking-wider text-slate-700 uppercase">
            Identity Resolution Graph Visualization
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 font-mono">Status:</span>
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase border ${
              identityStatus === 'RESOLVED'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : identityStatus === 'AMBIGUOUS'
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : identityStatus === 'CONFLICT'
                ? 'bg-rose-50 text-rose-700 border-rose-300'
                : 'bg-slate-100 text-slate-600 border-slate-300'
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
              <div className="px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-300 text-blue-900 text-xs font-mono font-bold shadow-xs text-center">
                <span className="text-[10px] text-blue-600 block font-sans uppercase">Browser Cookie</span>
                ANON-WEB-1001
              </div>
            </div>

            <div className="flex items-center justify-center text-slate-400">
              <span className="text-xs font-mono font-semibold text-indigo-700 px-2 py-1 bg-indigo-50 rounded border border-indigo-200">
                Auth Login →
              </span>
            </div>

            {/* Step 2: User Account */}
            <div className="flex flex-col items-center">
              <div className="px-4 py-2.5 rounded-xl bg-indigo-50 border border-indigo-300 text-indigo-900 text-xs font-mono font-bold shadow-xs text-center">
                <span className="text-[10px] text-indigo-600 block font-sans uppercase">User Profile</span>
                U-1001
              </div>
            </div>

            <div className="flex items-center justify-center text-slate-400">
              <span className="text-xs font-mono font-semibold text-emerald-700 px-2 py-1 bg-emerald-50 rounded border border-emerald-200">
                Stitched →
              </span>
            </div>

            {/* Step 3: Enterprise Customer */}
            <div className="flex flex-col items-center">
              <div className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono font-bold shadow-xs text-center">
                <span className="text-[10px] text-emerald-600 block font-sans uppercase">Master Customer</span>
                CUST-1001
                <span className="text-[10px] text-slate-600 block font-sans">Rahul Sharma</span>
              </div>
            </div>
          </div>

          {/* Secondary links (Mobile & Call Center) */}
          <div className="mt-5 pt-4 border-t border-slate-200 w-full max-w-xl flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-700">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-800">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>DEV-MOB-1001</span>
              <span className="text-slate-400">→</span>
              <span className="text-emerald-700 font-bold">CUST-1001</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Phone 9876500001</span>
              <span className="text-slate-400">→</span>
              <span className="text-emerald-700 font-bold">CUST-1001</span>
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
              <div className="px-5 py-2.5 rounded-xl bg-purple-50 border border-purple-300 text-purple-900 text-xs font-mono font-bold shadow-xs text-center">
                <span className="text-[10px] text-purple-600 block font-sans uppercase">Shared Browser Cookie</span>
                ANON-SHARED-01
              </div>
            </div>

            {/* Split branches */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Branch 1 */}
              <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-col items-center text-center shadow-2xs">
                <span className="text-[10px] font-mono text-blue-700 font-semibold uppercase mb-1">Session 1</span>
                <span className="text-xs font-mono text-slate-700 mb-2 font-medium">SES-SHARED-01</span>
                <ArrowDown className="w-3.5 h-3.5 text-blue-600 mb-2" />
                <span className="text-xs font-mono text-slate-500">User: U-1013</span>
                <div className="mt-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold font-mono">
                  CUST-1013 (Aarav Patel)
                </div>
              </div>

              {/* Branch 2 */}
              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col items-center text-center shadow-2xs">
                <span className="text-[10px] font-mono text-amber-700 font-semibold uppercase mb-1">Session 2</span>
                <span className="text-xs font-mono text-slate-700 mb-2 font-medium">SES-SHARED-02</span>
                <ArrowDown className="w-3.5 h-3.5 text-amber-600 mb-2" />
                <span className="text-xs font-mono text-slate-500">User: U-1014</span>
                <div className="mt-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold font-mono">
                  CUST-1014 (Sneha Verma)
                </div>
              </div>
            </div>

            <div className="mt-4 p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-600 text-center shadow-2xs">
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
              <div className="px-5 py-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono font-bold shadow-xs text-center">
                <span className="text-[10px] text-amber-700 block font-sans uppercase">Weak Identifier (No Phone / Email)</span>
                Name: "Amit Patel"
              </div>
            </div>

            <div className="flex justify-center mb-3">
              <span className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-mono flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                Confidence: LOW (50% Split) — Status: AMBIGUOUS
              </span>
            </div>

            {/* Split Candidates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl border border-dashed border-amber-300 bg-white flex flex-col items-center text-center shadow-2xs">
                <span className="text-[10px] font-mono text-slate-500 uppercase mb-1">Eligible Candidate 1</span>
                <span className="text-xs font-mono font-bold text-slate-800">CUST-1003</span>
                <span className="text-xs text-slate-600 mt-0.5">Amit Patel (Mumbai)</span>
                <span className="text-[10px] font-mono text-amber-800 mt-2 px-2 py-0.5 rounded bg-amber-50 border border-amber-200">Match: 50%</span>
              </div>

              <div className="p-3.5 rounded-xl border border-dashed border-amber-300 bg-white flex flex-col items-center text-center shadow-2xs">
                <span className="text-[10px] font-mono text-slate-500 uppercase mb-1">Eligible Candidate 2</span>
                <span className="text-xs font-mono font-bold text-slate-800">CUST-1004</span>
                <span className="text-xs text-slate-600 mt-0.5">Amit Patel (Ahmedabad)</span>
                <span className="text-[10px] font-mono text-amber-800 mt-2 px-2 py-0.5 rounded bg-amber-50 border border-amber-200">Match: 50%</span>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-amber-800 text-center font-mono">
              ⚠ System explicitly refused to auto-pick or merge records without verifying phone or account credentials.
            </p>
          </div>
        </div>
      )}

      {/* 4. Identity Conflict Scenario */}
      {scenarioId === 'identity-conflict' && (
        <div className="py-2 flex flex-col items-center">
          <div className="w-full max-w-lg">
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono mb-4 text-center flex items-center justify-center gap-2">
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Contradictory Evidence in Single Call Event</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Evidence 1 */}
              <div className="p-3.5 rounded-xl border border-rose-200 bg-white flex flex-col items-center text-center shadow-2xs">
                <span className="text-[10px] font-mono text-rose-600 uppercase mb-1 font-semibold">Evidence Source A</span>
                <div className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono text-slate-800 mb-2 font-bold">
                  Phone: 9876500010
                </div>
                <ArrowDown className="w-3.5 h-3.5 text-rose-500 mb-2" />
                <span className="text-[10px] text-slate-500 uppercase">Resolves to</span>
                <span className="text-xs font-mono font-bold text-emerald-700">CUST-1005</span>
                <span className="text-xs text-slate-600">Priya Nair</span>
              </div>

              {/* Evidence 2 */}
              <div className="p-3.5 rounded-xl border border-rose-200 bg-white flex flex-col items-center text-center shadow-2xs">
                <span className="text-[10px] font-mono text-rose-600 uppercase mb-1 font-semibold">Evidence Source B</span>
                <div className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono text-slate-800 mb-2 font-bold">
                  Order ID: ORD-9001
                </div>
                <ArrowDown className="w-3.5 h-3.5 text-rose-500 mb-2" />
                <span className="text-[10px] text-slate-500 uppercase">Resolves to</span>
                <span className="text-xs font-mono font-bold text-cyan-700">CUST-1006</span>
                <span className="text-xs text-slate-600">Vikram Mehta</span>
              </div>
            </div>

            <div className="mt-4 p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 text-center font-mono shadow-2xs">
              Status: <span className="text-rose-600 font-bold">CONFLICT</span> — Both evidence streams preserved without overwriting either customer record.
            </div>
          </div>
        </div>
      )}

      {/* 5. Multiple Phone Numbers */}
      {scenarioId === 'multiple-phone' && (
        <div className="py-2 flex flex-col items-center">
          <div className="w-full max-w-md">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-3 rounded-xl border border-blue-200 bg-white text-center shadow-2xs">
                <span className="text-[10px] text-blue-600 block font-mono uppercase font-semibold">Primary Phone</span>
                <span className="text-xs font-mono font-bold text-slate-900">+91 9876500015</span>
              </div>
              <div className="p-3 rounded-xl border border-purple-200 bg-white text-center shadow-2xs">
                <span className="text-[10px] text-purple-600 block font-mono uppercase font-semibold">Secondary Phone</span>
                <span className="text-xs font-mono font-bold text-slate-900">+91 9876500099</span>
              </div>
            </div>

            <div className="flex justify-center my-2">
              <span className="text-xs font-mono text-emerald-700 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 flex items-center gap-1.5 font-semibold">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Both Identifiers Converge
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50 text-center shadow-2xs">
              <span className="text-[10px] text-emerald-700 block font-mono uppercase font-semibold">Unified Customer Record</span>
              <span className="text-sm font-mono font-bold text-emerald-900">CUST-1015</span>
              <span className="text-xs text-slate-600 block">Rohan Gupta</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. Unresolved Scenario */}
      {scenarioId === 'unresolved' && (
        <div className="py-2 flex flex-col items-center">
          <div className="w-full max-w-md p-4 rounded-xl border border-slate-300 bg-white text-center shadow-xs">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <span className="text-xs font-mono text-slate-800 block font-semibold mb-1">
              ANON-UNKNOWN-999 / DEV-UNKNOWN
            </span>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mb-3">
              Zero verifiable identifiers (no customer_id, user_id, email, phone, or order).
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-semibold">
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
                    className={`px-3.5 py-2 rounded-xl border text-center font-mono shadow-xs ${
                      node.type === 'cust'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : node.type === 'conflict'
                        ? 'bg-rose-50 border-rose-300 text-rose-900'
                        : node.type === 'ambiguous'
                        ? 'bg-amber-50 border-amber-300 text-amber-900'
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <span className="text-xs font-bold block">{node.label}</span>
                    {node.subtitle && (
                      <span className="text-[10px] text-slate-500 block">{node.subtitle}</span>
                    )}
                  </div>

                  {i < (result.graphNodes?.length || 0) - 1 && (
                    <span className="text-slate-400 font-mono text-sm font-bold">➔</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};
