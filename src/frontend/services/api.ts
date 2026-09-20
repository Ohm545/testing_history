import { ApiResponse, DashboardMetrics, SimulatorEvent, IngestEventsPayload } from '../../shared/types';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errMsg = `HTTP Error ${res.status}: ${res.statusText}`;
    try {
      const json = await res.json();
      if (json && json.message) errMsg = json.message;
    } catch {
      // ignore json parse error
    }
    throw new Error(errMsg);
  }
  return res.json();
}

export const api = {
  async checkHealth(): Promise<{ status: string; service: string }> {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
    return handleResponse<{ status: string; service: string }>(res);
  },

  async getEvents(params?: {
    channel?: string;
    event_type?: string;
    scenario?: string;
    search?: string;
  }): Promise<{ success: boolean; count: number; events: SimulatorEvent[] }> {
    const query = new URLSearchParams();
    if (params?.channel && params.channel !== 'all') query.set('channel', params.channel);
    if (params?.event_type && params.event_type !== 'all') query.set('event_type', params.event_type);
    if (params?.scenario && params.scenario !== 'all') query.set('scenario', params.scenario);
    if (params?.search && params.search.trim()) query.set('search', params.search.trim());

    const url = `${API_BASE}/events${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url, { method: 'GET' });
    return handleResponse<{ success: boolean; count: number; events: SimulatorEvent[] }>(res);
  },

  async getEventById(eventId: string): Promise<{ success: boolean; event: SimulatorEvent }> {
    const res = await fetch(`${API_BASE}/events/${encodeURIComponent(eventId)}`, { method: 'GET' });
    return handleResponse<{ success: boolean; event: SimulatorEvent }>(res);
  },

  async getMetrics(): Promise<{ success: boolean; metrics: DashboardMetrics }> {
    const res = await fetch(`${API_BASE}/events/metrics/summary`, { method: 'GET' });
    return handleResponse<{ success: boolean; metrics: DashboardMetrics }>(res);
  },

  async runScenario(scenarioId: string): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE}/demo/scenario/${encodeURIComponent(scenarioId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse<ApiResponse>(res);
  },

  async sendEvent(eventPayload: Partial<SimulatorEvent>): Promise<ApiResponse> {
    const body: IngestEventsPayload = { event: eventPayload };
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return handleResponse<ApiResponse>(res);
  },

  async sendBatchEvents(eventsList: Partial<SimulatorEvent>[]): Promise<ApiResponse> {
    const body: IngestEventsPayload = { events: eventsList };
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return handleResponse<ApiResponse>(res);
  },

  async resetDemo(): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  }
};
