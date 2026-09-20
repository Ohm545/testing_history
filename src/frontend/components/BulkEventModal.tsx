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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0F172A] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-gray-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Bulk Synthetic Event Generator</h3>
              <p className="text-xs text-gray-400">Generate realistic batches with spaced timestamps</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-mono font-medium text-gray-300 mb-2">
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
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-lg shadow-cyan-500/10 scale-[1.02]'
                      : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-850'
                  }`}
                >
                  {num} Events
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-950/60 border border-gray-800 text-xs text-gray-400 space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span>Target Endpoint:</span>
              <span className="text-emerald-400 font-semibold">POST /events</span>
            </div>
            <div className="flex justify-between">
              <span>Channels Simulated:</span>
              <span className="text-gray-300">Web, Mobile, IVR, Store</span>
            </div>
            <div className="flex justify-between">
              <span>Timestamps:</span>
              <span className="text-cyan-400">Realistic chronological spacing</span>
            </div>
          </div>

          {responseInfo && (
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs font-mono">
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{responseInfo.count} Events Ingested Successfully</span>
              </div>
              <p className="text-gray-300 text-[11px]">
                Event IDs: {responseInfo.eventIds.slice(0, 4).join(', ')}
                {responseInfo.eventIds.length > 4 && ` ... +${responseInfo.eventIds.length - 4} more`}
              </p>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-xs font-bold text-white shadow-lg shadow-cyan-600/30 transition-all disabled:opacity-50"
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
