import React, { useState } from 'react';
import { EventChannel, SimulatorEvent } from '../../shared/types';
import { X, Layers, Loader2, CheckCircle2 } from 'lucide-react';

interface BulkEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateBatch: (batch: Partial<SimulatorEvent>[]) => Promise<any>;
}

export const BulkEventModal: React.FC<BulkEventModalProps> = ({
  isOpen,
  onClose,
  onGenerateBatch
}) => {
  const [count, setCount] = useState<number>(25);
  const [loading, setLoading] = useState(false);
  const [responseInfo, setResponseInfo] = useState<{ count: number; eventIds: string[] } | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setResponseInfo(null);

    const syntheticEvents: Partial<SimulatorEvent>[] = [];
    const now = Date.now();
    const channels: EventChannel[] = ['web', 'mobile_app', 'call_center', 'physical_store'];
    const eventTypesMap: Record<EventChannel, string[]> = {
      web: ['page_view', 'product_view', 'add_to_cart', 'checkout_started', 'purchase', 'login'],
      mobile_app: ['app_open', 'product_view', 'add_to_cart', 'order_tracking', 'purchase'],
      call_center: ['support_call', 'support_case_created', 'case_escalated'],
      physical_store: ['store_visit', 'product_consultation', 'store_purchase']
    };

    const customers = [
      { id: 'CUST-5001', name: 'Aakash Verma', phone: '9876543001', email: 'aakash@example.com' },
      { id: 'CUST-5002', name: 'Divya Shah', phone: '9876543002', email: 'divya@example.com' },
      { id: 'CUST-5003', name: 'Kavita Pillai', phone: '9876543003', email: 'kavita@example.com' },
      { id: 'CUST-5004', name: 'Arjun Singhania', phone: '9876543004', email: 'arjun@example.com' },
      { id: null, name: null, phone: null, email: null } // Anonymous
    ];

    for (let i = 0; i < count; i++) {
      const channel = channels[Math.floor(Math.random() * channels.length)];
      const types = eventTypesMap[channel];
      const eventType = types[Math.floor(Math.random() * types.length)];
      const cust = customers[Math.floor(Math.random() * customers.length)];
      const timeOffsetSec = i * 45 + Math.floor(Math.random() * 30);
      const sessionNum = Math.floor(i / 4) + 1;

      syntheticEvents.push({
        channel,
        event_type: eventType,
        session_id: `SES-BATCH-${sessionNum}`,
        anonymous_id: `ANON-BATCH-${sessionNum}`,
        user_id: cust.id ? `U-${cust.id.replace('CUST-', '')}` : null,
        customer_id: cust.id,
        email: cust.email,
        phone: cust.phone,
        order_id: eventType.includes('purchase') ? `ORD-BATCH-${1000 + i}` : null,
        timestamp: new Date(now - (count - i) * 60000 + timeOffsetSec * 1000).toISOString(),
        scenario_id: 'batch-generated',
        data: {
          synthetic_batch: true,
          batch_index: i + 1,
          simulated_channel: channel
        }
      });
    }

    try {
      const res = await onGenerateBatch(syntheticEvents);
      if (res && res.success) {
        setResponseInfo({
          count: res.received || count,
          eventIds: res.event_ids || []
        });
      }
    } catch {
      // handled in parent toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-600">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Bulk Synthetic Event Generator</h3>
              <p className="text-xs text-slate-500">Generate realistic batches with spaced timestamps</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-mono font-medium text-slate-700 mb-2">
              Select Batch Volume:
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[10, 25, 50, 100].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCount(num)}
                  className={`py-3 px-2 rounded-xl border text-center font-mono font-bold text-sm transition-all ${
                    count === num
                      ? 'bg-cyan-50 text-cyan-800 border-cyan-400 shadow-sm scale-[1.02]'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {num} Events
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span>Target Endpoint:</span>
              <span className="text-emerald-700 font-semibold">POST /events</span>
            </div>
            <div className="flex justify-between">
              <span>Channels Simulated:</span>
              <span className="text-slate-800 font-medium">Web, Mobile, IVR, Store</span>
            </div>
            <div className="flex justify-between">
              <span>Timestamps:</span>
              <span className="text-cyan-700 font-medium">Realistic chronological spacing</span>
            </div>
          </div>

          {responseInfo && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono">
              <div className="flex items-center gap-2 text-emerald-700 font-bold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{responseInfo.count} Events Ingested Successfully</span>
              </div>
              <p className="text-slate-700 text-[11px]">
                Event IDs: {responseInfo.eventIds.slice(0, 4).join(', ')}
                {responseInfo.eventIds.length > 4 && ` ... +${responseInfo.eventIds.length - 4} more`}
              </p>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-xs font-bold text-white shadow-md shadow-cyan-600/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Dispatching {count} events...</span>
                </>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5" />
                  <span>Generate Batch ({count})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
