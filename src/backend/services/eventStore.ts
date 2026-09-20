import { SimulatorEvent, DashboardMetrics, IdentityStatus, EventChannel } from '../../shared/types';

class EventStore {
  private events: SimulatorEvent[] = [];
  private eventCounter: number = 0;

  public generateEventId(): string {
    this.eventCounter += 1;
    return `EVT-${String(this.eventCounter).padStart(6, '0')}`;
  }

  public validateAndNormalizeEvent(raw: Partial<SimulatorEvent>): SimulatorEvent {
    const eventId = raw.event_id && raw.event_id.trim() !== '' ? raw.event_id : this.generateEventId();
    const timestamp = raw.timestamp && raw.timestamp.trim() !== '' ? raw.timestamp : new Date().toISOString();
    const channel: EventChannel = raw.channel || 'web';
    const eventType = raw.event_type || 'custom_event';

    // Determine identity status if not specified
    let identityStatus: IdentityStatus = raw.identity_status || 'UNRESOLVED';
    if (!raw.identity_status) {
      if (raw.candidates && raw.candidates.length > 1) {
        identityStatus = raw.candidates[0].includes('CONFLICT') ? 'CONFLICT' : 'AMBIGUOUS';
      } else if (raw.customer_id || raw.user_id) {
        identityStatus = 'RESOLVED';
      } else {
        identityStatus = 'UNRESOLVED';
      }
    }

    const normalized: SimulatorEvent = {
      event_id: eventId,
      timestamp,
      channel,
      event_type: eventType,
      session_id: raw.session_id ?? null,
      anonymous_id: raw.anonymous_id ?? null,
      user_id: raw.user_id ?? null,
      customer_id: raw.customer_id ?? null,
      email: raw.email ?? null,
      phone: raw.phone ?? null,
      account_id: raw.account_id ?? null,
      loyalty_id: raw.loyalty_id ?? null,
      order_id: raw.order_id ?? null,
      case_id: raw.case_id ?? null,
      device_id: raw.device_id ?? null,
      data: raw.data && typeof raw.data === 'object' ? raw.data : {},
      scenario_id: raw.scenario_id ?? null,
      identity_status: identityStatus,
      confidence: raw.confidence,
      candidates: raw.candidates
    };

    return normalized;
  }

  public ingestEvent(raw: Partial<SimulatorEvent>): SimulatorEvent {
    const event = this.validateAndNormalizeEvent(raw);
    this.events.push(event);
    return event;
  }

  public ingestBatch(rawList: Partial<SimulatorEvent>[]): SimulatorEvent[] {
    return rawList.map((raw) => this.ingestEvent(raw));
  }

  public getAllEvents(filter?: {
    channel?: string;
    event_type?: string;
    scenario?: string;
    search?: string;
  }): SimulatorEvent[] {
    let result = [...this.events];

    if (filter) {
      if (filter.channel && filter.channel !== 'all') {
        result = result.filter(e => e.channel.toLowerCase() === filter.channel?.toLowerCase());
      }
      if (filter.event_type && filter.event_type !== 'all') {
        result = result.filter(e => e.event_type.toLowerCase() === filter.event_type?.toLowerCase());
      }
      if (filter.scenario && filter.scenario !== 'all') {
        result = result.filter(e => e.scenario_id === filter.scenario);
      }
      if (filter.search && filter.search.trim() !== '') {
        const q = filter.search.toLowerCase();
        result = result.filter(e =>
          e.event_id.toLowerCase().includes(q) ||
          e.event_type.toLowerCase().includes(q) ||
          (e.customer_id && e.customer_id.toLowerCase().includes(q)) ||
          (e.user_id && e.user_id.toLowerCase().includes(q)) ||
          (e.anonymous_id && e.anonymous_id.toLowerCase().includes(q)) ||
          (e.session_id && e.session_id.toLowerCase().includes(q)) ||
          (e.phone && e.phone.includes(q)) ||
          (e.email && e.email.toLowerCase().includes(q)) ||
          (e.order_id && e.order_id.toLowerCase().includes(q)) ||
          (e.case_id && e.case_id.toLowerCase().includes(q))
        );
      }
    }

    return result;
  }

  public getEventById(eventId: string): SimulatorEvent | undefined {
    return this.events.find(e => e.event_id.toLowerCase() === eventId.toLowerCase());
  }

  public getMetrics(): DashboardMetrics {
    const sessions = new Set<string>();
    const anonIds = new Set<string>();
    const customers = new Set<string>();

    let web = 0;
    let mobile = 0;
    let callCenter = 0;
    let store = 0;

    for (const evt of this.events) {
      if (evt.session_id) sessions.add(evt.session_id);
      if (evt.anonymous_id) anonIds.add(evt.anonymous_id);
      if (evt.customer_id) customers.add(evt.customer_id);

      switch (evt.channel) {
        case 'web':
          web++;
          break;
        case 'mobile_app':
          mobile++;
          break;
        case 'call_center':
          callCenter++;
          break;
        case 'physical_store':
          store++;
          break;
      }
    }

    return {
      totalEvents: this.events.length,
      uniqueSessions: sessions.size,
      uniqueAnonymousIds: anonIds.size,
      uniqueCustomers: customers.size,
      webEvents: web,
      mobileEvents: mobile,
      callCenterEvents: callCenter,
      storeEvents: store,
    };
  }

  public reset(): void {
    this.events = [];
    this.eventCounter = 0;
  }
}

export const eventStore = new EventStore();
