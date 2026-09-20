import React, { useState, useEffect, useCallback, useRef } from 'react';
import { api } from './services/api';
import { DashboardMetrics, ScenarioResult, SimulatorEvent } from '../shared/types';
import { ALL_SCENARIOS_METADATA } from '../shared/scenariosList';
import { Navbar } from './components/Navbar';
import { HeroPipeline } from './components/HeroPipeline';
import { MetricsGrid } from './components/MetricsGrid';
import { ScenarioSection } from './components/ScenarioSection';
import { ScenarioResultPanel } from './components/ScenarioResultPanel';
import { FilterBar } from './components/FilterBar';
import { EventTable } from './components/EventTable';
import { EventDetailsDrawer } from './components/EventDetailsDrawer';
import { CustomEventModal } from './components/CustomEventModal';
import { BulkEventModal } from './components/BulkEventModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { ToastContainer, ToastItem } from './components/ToastContainer';

export const App: React.FC = () => {
  // Connection and data state
  const [apiConnected, setApiConnected] = useState<boolean>(false);
  const [events, setEvents] = useState<SimulatorEvent[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalEvents: 0,
    uniqueSessions: 0,
    uniqueAnonymousIds: 0,
    uniqueCustomers: 0,
    webEvents: 0,
    mobileEvents: 0,
    callCenterEvents: 0,
    storeEvents: 0
  });

  // Scenario execution state
  const [runningScenarioId, setRunningScenarioId] = useState<string | null>(null);
  const [scenarioResult, setScenarioResult] = useState<ScenarioResult | null>(null);

  // Filters state
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [scenarioFilter, setScenarioFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawer state
  const [selectedEvent, setSelectedEvent] = useState<SimulatorEvent | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Toasts state
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastCounterRef = useRef(0);

  const addToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    toastCounterRef.current += 1;
    const id = `toast-${toastCounterRef.current}-${Date.now()}`;
    const newToast: ToastItem = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch metrics & events
  const loadData = useCallback(async () => {
    try {
      const [eventsRes, metricsRes] = await Promise.all([
        api.getEvents({
          channel: channelFilter,
          event_type: eventTypeFilter,
          scenario: scenarioFilter,
          search: searchQuery
        }),
        api.getMetrics()
      ]);

      if (eventsRes && eventsRes.events) {
        setEvents(eventsRes.events);
      }
      if (metricsRes && metricsRes.metrics) {
        setMetrics(metricsRes.metrics);
      }
      setApiConnected(true);
    } catch (err: any) {
      // Check health directly if query failed
      try {
        await api.checkHealth();
        setApiConnected(true);
      } catch {
        setApiConnected(false);
      }
    }
  }, [channelFilter, eventTypeFilter, scenarioFilter, searchQuery]);

  // Initial load and periodic health/sync check
  useEffect(() => {
    loadData();

    const interval = setInterval(async () => {
      try {
        await api.checkHealth();
        setApiConnected(true);
      } catch {
        setApiConnected(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [loadData]);

  // Execute scenario
  const handleRunScenario = async (scenarioId: string) => {
    setRunningScenarioId(scenarioId);
    try {
      const res = await api.runScenario(scenarioId);

      if (res && res.success) {
        // Refresh event stream & metrics
        await loadData();

        if (res.analysis) {
          setScenarioResult(res.analysis);
        }

        // Contextual toast notification
        if (scenarioId === 'identity-ambiguity') {
          addToast({
            type: 'warning',
            title: '⚠ Identity Ambiguity Detected',
            message: 'Weak identifier matched two candidates. Marked status: AMBIGUOUS (Confidence: LOW).'
          });
        } else if (scenarioId === 'identity-conflict') {
          addToast({
            type: 'error',
            title: '⚠ Identity Conflict Detected',
            message: 'Contradictory evidence: Phone maps to CUST-1005 while Order belongs to CUST-1006.'
          });
        } else {
          addToast({
            type: 'success',
            title: `✓ ${res.events_generated || 'Multiple'} events generated successfully`,
            message: `Events processed through POST /events and ingested into pipeline.`
          });
        }
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: '✕ Failed to execute scenario',
        message: err.message || 'Unable to reach event ingestion API. Make sure the backend is running.'
      });
    } finally {
      setRunningScenarioId(null);
    }
  };

  // Dispatch custom manual event
  const handleSendCustomEvent = async (eventPayload: Partial<SimulatorEvent>) => {
    try {
      const res = await api.sendEvent(eventPayload);
      await loadData();
      addToast({
        type: 'success',
        title: '✓ Custom Event Sent',
        message: `Event ${res.event_ids?.[0] || 'EVT'} ingested successfully via POST /events.`
      });
      return res;
    } catch (err: any) {
      addToast({
        type: 'error',
        title: '✕ Failed to send custom event',
        message: err.message || 'Error occurred while contacting backend.'
      });
      throw err;
    }
  };

  // Dispatch bulk batch
  const handleGenerateBatch = async (batch: Partial<SimulatorEvent>[]) => {
    try {
      const res = await api.sendBatchEvents(batch);
      await loadData();
      addToast({
        type: 'success',
        title: `✓ Batch Generated (${res.received || batch.length} Events)`,
        message: `Events delivered via POST /events with realistic chronological spacing.`
      });
      return res;
    } catch (err: any) {
      addToast({
        type: 'error',
        title: '✕ Batch generation failed',
        message: err.message || 'Could not dispatch batch.'
      });
      throw err;
    }
  };

  // Reset simulation demo
  const handleResetDemo = async () => {
    try {
      const res = await api.resetDemo();
      setScenarioResult(null);
      await loadData();
      addToast({
        type: 'info',
        title: '✓ Demo Reset Successfully',
        message: res.message || 'In-memory event store cleared. Ready for next simulation run.'
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: '✕ Reset failed',
        message: err.message || 'Failed to clear store.'
      });
    }
  };

  // Export JSON
  const handleExportJson = () => {
    if (events.length === 0) {
      addToast({ type: 'warning', title: 'Export Failed', message: 'No events stored to export.' });
      return;
    }
    const jsonStr = JSON.stringify(events, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journeyflow-events-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({ type: 'success', title: 'Export JSON', message: `Exported ${events.length} events to JSON file.` });
  };

  // Export CSV
  const handleExportCsv = () => {
    if (events.length === 0) {
      addToast({ type: 'warning', title: 'Export Failed', message: 'No events stored to export.' });
      return;
    }

    const headers = [
      'event_id',
      'timestamp',
      'channel',
      'event_type',
      'session_id',
      'anonymous_id',
      'user_id',
      'customer_id',
      'email',
      'phone',
      'order_id',
      'case_id',
      'device_id',
      'identity_status'
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = events.map((e) => [
      e.event_id,
      e.timestamp,
      e.channel,
      e.event_type,
      e.session_id,
      e.anonymous_id,
      e.user_id,
      e.customer_id,
      e.email,
      e.phone,
      e.order_id,
      e.case_id,
      e.device_id,
      e.identity_status
    ].map(escapeCsv).join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journeyflow-events-${new Date().toISOString().replace(/[:.]/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({ type: 'success', title: 'Export CSV', message: `Exported ${events.length} events to CSV file.` });
  };

  const handleResetFilters = () => {
    setChannelFilter('all');
    setEventTypeFilter('all');
    setScenarioFilter('all');
    setSearchQuery('');
  };

  const scrollToEvents = () => {
    const el = document.getElementById('events-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        apiConnected={apiConnected}
        eventCount={metrics.totalEvents}
        onOpenReset={() => setIsResetModalOpen(true)}
        onOpenCustomEvent={() => setIsCustomModalOpen(true)}
        onOpenBulkModal={() => setIsBulkModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {/* Offline Alert if Backend is Disconnected */}
        {!apiConnected && (
          <div className="mb-6 p-4 rounded-xl border border-rose-500/40 bg-rose-950/30 text-rose-200 text-xs font-mono flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>
                Unable to reach event ingestion API. Make sure the backend is running at{' '}
                <strong className="text-white underline">http://localhost:3000</strong>.
              </span>
            </div>
            <button
              onClick={loadData}
              className="px-3 py-1 bg-rose-600/30 hover:bg-rose-600/50 rounded-lg text-rose-100 text-xs font-semibold transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Hero Section with Visual Simulation Pipeline */}
        <HeroPipeline />

        {/* Dynamic Computed Dashboard Metrics */}
        <MetricsGrid metrics={metrics} />

        {/* Scenario Execution Result Panel (if generated) */}
        {scenarioResult && (
          <ScenarioResultPanel
            result={scenarioResult}
            onDismiss={() => setScenarioResult(null)}
            onScrollToEvents={scrollToEvents}
          />
        )}

        {/* All 15 Required Scenarios Grid */}
        <ScenarioSection
          scenarios={ALL_SCENARIOS_METADATA}
          runningScenarioId={runningScenarioId}
          onRunScenario={handleRunScenario}
        />

        {/* Live Ingested Events Stream Section */}
        <section id="events-section" className="mb-12 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-2xl font-bold tracking-tight text-white">Live Event Stream</h3>
            <span className="text-xs font-mono text-gray-400">
              Preserving full identity attributes & evidence
            </span>
          </div>

          {/* Filters Bar with Export & Search */}
          <FilterBar
            channel={channelFilter}
            eventType={eventTypeFilter}
            scenario={scenarioFilter}
            search={searchQuery}
            scenarios={ALL_SCENARIOS_METADATA}
            onChannelChange={setChannelFilter}
            onEventTypeChange={setEventTypeFilter}
            onScenarioChange={setScenarioFilter}
            onSearchChange={setSearchQuery}
            onResetFilters={handleResetFilters}
            onExportJson={handleExportJson}
            onExportCsv={handleExportCsv}
            totalFilteredEvents={events.length}
          />

          {/* Event Table */}
          <EventTable
            events={events}
            onSelectEvent={(evt) => setSelectedEvent(evt)}
            onRunFirstScenario={() => handleRunScenario('identity-resolution')}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-800/80 bg-gray-950/60 py-6 px-4 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
          <div>
            <span className="text-indigo-400 font-semibold">JourneyFlow Simulator</span> — Cross-Channel Identity Resolution & Customer Journey Intelligence
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>POST /events</span>
            <span>•</span>
            <span>In-Memory Event Store</span>
            <span>•</span>
            <span>REST API Ready</span>
          </div>
        </div>
      </footer>

      {/* Event Details Drawer */}
      <EventDetailsDrawer
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      {/* Manual Single Event Modal */}
      <CustomEventModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSubmit={handleSendCustomEvent}
      />

      {/* Bulk Batch Generator Modal */}
      <BulkEventModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onGenerateBatch={handleGenerateBatch}
      />

      {/* Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetDemo}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
