import React from 'react';
import { Search, Download, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { ScenarioMetadata } from '../../shared/types';

interface FilterBarProps {
  channel: string;
  eventType: string;
  scenario: string;
  search: string;
  scenarios: ScenarioMetadata[];
  onChannelChange: (val: string) => void;
  onEventTypeChange: (val: string) => void;
  onScenarioChange: (val: string) => void;
  onSearchChange: (val: string) => void;
  onResetFilters: () => void;
  onExportJson: () => void;
  onExportCsv: () => void;
  totalFilteredEvents: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  channel,
  eventType,
  scenario,
  search,
  scenarios,
  onChannelChange,
  onEventTypeChange,
  onScenarioChange,
  onSearchChange,
  onResetFilters,
  onExportJson,
  onExportCsv,
  totalFilteredEvents
}) => {
  const eventTypes = [
    { value: 'all', label: 'All Event Types' },
    { value: 'page_view', label: 'Page View' },
    { value: 'product_view', label: 'Product View' },
    { value: 'add_to_cart', label: 'Add to Cart' },
    { value: 'checkout_started', label: 'Checkout Started' },
    { value: 'payment_attempt', label: 'Payment Attempt' },
    { value: 'payment_failed', label: 'Payment Failed' },
    { value: 'purchase', label: 'Purchase' },
    { value: 'login', label: 'Login' },
    { value: 'app_open', label: 'App Open' },
    { value: 'mobile_app_open', label: 'Mobile App Open' },
    { value: 'order_tracking', label: 'Order Tracking' },
    { value: 'support_call', label: 'Support Call' },
    { value: 'support_case_created', label: 'Support Case Created' },
    { value: 'case_escalated', label: 'Case Escalated' },
    { value: 'store_visit', label: 'Store Visit' },
    { value: 'product_consultation', label: 'Store Consultation' },
    { value: 'store_purchase', label: 'Store Purchase' }
  ];

  const hasActiveFilters = channel !== 'all' || eventType !== 'all' || scenario !== 'all' || search.trim() !== '';

  return (
    <div className="mb-4 p-4 rounded-xl border border-gray-800 bg-gray-900/60 backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Filter selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 flex-1">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search ID, customer, phone..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-gray-950 border border-gray-800 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Channel select */}
          <div>
            <select
              value={channel}
              onChange={(e) => onChannelChange(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-gray-950 border border-gray-800 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="all">All Channels</option>
              <option value="web">Web</option>
              <option value="mobile_app">Mobile App</option>
              <option value="call_center">Call Center</option>
              <option value="physical_store">Physical Store</option>
            </select>
          </div>

          {/* Event type select */}
          <div>
            <select
              value={eventType}
              onChange={(e) => onEventTypeChange(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-gray-950 border border-gray-800 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {eventTypes.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Scenario select */}
          <div>
            <select
              value={scenario}
              onChange={(e) => onScenarioChange(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-gray-950 border border-gray-800 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="all">All Scenarios</option>
              {scenarios.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action buttons: Reset Filters & Exports */}
        <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-800">
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition-colors"
              title="Reset all filters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <span className="text-xs font-mono text-gray-400 hidden xl:inline px-1">
            Matching: <strong className="text-white">{totalFilteredEvents}</strong>
          </span>

          <button
            onClick={onExportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 text-xs font-semibold transition-all"
            title="Download currently filtered events as JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-xs font-semibold transition-all"
            title="Download currently filtered events as CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
