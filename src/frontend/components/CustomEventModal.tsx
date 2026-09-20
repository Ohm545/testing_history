import React, { useState } from 'react';
import { EventChannel, SimulatorEvent } from '../../shared/types';
import { X, Send, Loader2, Sparkles, CheckCircle } from 'lucide-react';

interface CustomEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: Partial<SimulatorEvent>) => Promise<any>;
}

export const CustomEventModal: React.FC<CustomEventModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [channel, setChannel] = useState<EventChannel>('web');
  const [eventType, setEventType] = useState('page_view');
  const [sessionId, setSessionId] = useState('SES-MANUAL-01');
  const [anonymousId, setAnonymousId] = useState('ANON-MANUAL-01');
  const [userId, setUserId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [accountId, setAccountId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [caseId, setCaseId] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [customDataJson, setCustomDataJson] = useState('{\n  "custom_field": "manual_simulation"\n}');
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setJsonError(null);
    let parsedData = {};
    if (customDataJson.trim()) {
      try {
        parsedData = JSON.parse(customDataJson);
      } catch {
        setJsonError('Invalid JSON in custom data payload.');
        return;
      }
    }

    const payload: Partial<SimulatorEvent> = {
      channel,
      event_type: eventType,
      session_id: sessionId.trim() || null,
      anonymous_id: anonymousId.trim() || null,
      user_id: userId.trim() || null,
      customer_id: customerId.trim() || null,
      email: email.trim() || null,
      phone: phone.trim() || null,
      account_id: accountId.trim() || null,
      order_id: orderId.trim() || null,
      case_id: caseId.trim() || null,
      device_id: deviceId.trim() || null,
      data: parsedData,
      scenario_id: 'manual-custom'
    };

    setLoading(true);
    try {
      const res = await onSubmit(payload);
      setApiResponse(res);
    } catch (err: any) {
      setApiResponse({ success: false, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Manual Custom Event Generator</h3>
              <p className="text-xs text-slate-500">Directly dispatch a customized synthetic event to POST /events</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Channel */}
            <div>
              <label className="block text-xs font-mono font-medium text-slate-700 mb-1">
                Channel *
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as EventChannel)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
              >
                <option value="web">web</option>
                <option value="mobile_app">mobile_app</option>
                <option value="call_center">call_center</option>
                <option value="physical_store">physical_store</option>
              </select>
            </div>

            {/* Event Type */}
            <div>
              <label className="block text-xs font-mono font-medium text-slate-700 mb-1">
                Event Type *
              </label>
              <input
                type="text"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                placeholder="e.g. page_view, purchase, login"
              />
            </div>

            {/* Session ID */}
            <div>
              <label className="block text-xs font-mono font-medium text-slate-700 mb-1">
                Session ID
              </label>
              <input
                type="text"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                placeholder="SES-..."
              />
            </div>

            {/* Anonymous ID */}
            <div>
              <label className="block text-xs font-mono font-medium text-slate-700 mb-1">
                Anonymous ID
              </label>
              <input
                type="text"
                value={anonymousId}
                onChange={(e) => setAnonymousId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                placeholder="ANON-..."
              />
            </div>

            {/* User ID */}
            <div>
              <label className="block text-xs font-mono font-medium text-slate-700 mb-1">
                User ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                placeholder="U-..."
              />
            </div>

            {/* Customer ID */}
            <div>
              <label className="block text-xs font-mono font-medium text-slate-700 mb-1">
                Customer ID
              </label>
              <input
                type="text"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                placeholder="CUST-..."
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-mono font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                placeholder="name@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-mono font-medium text-slate-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                placeholder="9876500000"
              />
            </div>

            {/* Account ID */}
            <div>
              <label className="block text-xs font-mono font-medium text-slate-700 mb-1">
                Account ID
              </label>
              <input
                type="text"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                placeholder="ACC-..."
              />
            </div>

            {/* Order ID */}
            <div>
              <label className="block text-xs font-mono font-medium text-slate-700 mb-1">
                Order ID
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                placeholder="ORD-..."
              />
            </div>

            {/* Case ID */}
            <div>
              <label className="block text-xs font-mono font-medium text-slate-700 mb-1">
                Case ID
              </label>
              <input
                type="text"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                placeholder="CASE-..."
              />
            </div>

            {/* Device ID */}
            <div>
              <label className="block text-xs font-mono font-medium text-slate-700 mb-1">
                Device ID
              </label>
              <input
                type="text"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                placeholder="DEV-..."
              />
            </div>
          </div>

          {/* Custom data payload */}
          <div>
            <label className="block text-xs font-mono font-medium text-slate-700 mb-1">
              Custom Data JSON (data object)
            </label>
            <textarea
              rows={3}
              value={customDataJson}
              onChange={(e) => setCustomDataJson(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-cyan-300 focus:outline-none focus:border-indigo-500"
            />
            {jsonError && <p className="text-xs text-rose-600 mt-1">{jsonError}</p>}
          </div>

          {/* Live Response feedback if sent */}
          {apiResponse && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">API Ingestion Response (HTTP 201)</span>
              </div>
              <pre className="text-slate-800 overflow-x-auto text-[11px] bg-white p-2 rounded border border-slate-200">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
            >
              Close
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending to POST /events...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Event</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
