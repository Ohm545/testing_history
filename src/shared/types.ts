export type EventChannel = 'web' | 'mobile_app' | 'call_center' | 'physical_store';

export type EventType =
  | 'page_view'
  | 'product_view'
  | 'add_to_cart'
  | 'login'
  | 'checkout_started'
  | 'payment_attempt'
  | 'payment_failed'
  | 'purchase'
  | 'app_open'
  | 'mobile_app_open'
  | 'order_tracking'
  | 'support_call'
  | 'support_case_created'
  | 'case_escalated'
  | 'store_visit'
  | 'product_consultation'
  | 'store_purchase'
  | 'no_purchase'
  | string;

export type IdentityStatus = 'RESOLVED' | 'UNRESOLVED' | 'AMBIGUOUS' | 'CONFLICT';

export interface SimulatorEvent {
  event_id: string;
  timestamp: string;
  channel: EventChannel;
  event_type: string;
  session_id: string | null;
  anonymous_id: string | null;
  user_id: string | null;
  customer_id: string | null;
  email: string | null;
  phone: string | null;
  account_id: string | null;
  loyalty_id: string | null;
  order_id: string | null;
  case_id: string | null;
  device_id: string | null;
  data: Record<string, any>;
  scenario_id?: string | null;
  identity_status?: IdentityStatus;
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  candidates?: string[];
}

export type ScenarioCategory = 'identity' | 'journey' | 'channels';

export interface ScenarioMetadata {
  id: string;
  name: string;
  description: string;
  category: ScenarioCategory;
  channels: EventChannel[];
  expectedEvents: number;
  expectedOutcome: string;
  iconName: string;
  customer?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  explanation: string;
  identityGraphType?: 'linear' | 'shared_browser' | 'ambiguous' | 'conflict' | 'unresolved' | 'multiple_phone';
}

export interface ScenarioChecklistItem {
  label: string;
  status: 'checked' | 'warning' | 'info';
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'anon' | 'user' | 'cust' | 'session' | 'evidence' | 'conflict' | 'ambiguous';
  subtitle?: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
}

export interface ScenarioResult {
  scenarioId: string;
  name: string;
  category: ScenarioCategory;
  eventsGenerated: number;
  detectedPattern: string;
  identityStatus: IdentityStatus;
  checklist: ScenarioChecklistItem[];
  explanation: string;
  identityGraphType?: 'linear' | 'shared_browser' | 'ambiguous' | 'conflict' | 'unresolved' | 'multiple_phone';
  graphNodes?: GraphNode[];
  graphEdges?: GraphEdge[];
}

export interface DashboardMetrics {
  totalEvents: number;
  uniqueSessions: number;
  uniqueAnonymousIds: number;
  uniqueCustomers: number;
  webEvents: number;
  mobileEvents: number;
  callCenterEvents: number;
  storeEvents: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  received?: number;
  event_ids?: string[];
  scenario?: string;
  events_generated?: number;
  events?: SimulatorEvent[];
  metadata?: ScenarioMetadata;
  analysis?: ScenarioResult;
}

export interface IngestEventsPayload {
  event?: Partial<SimulatorEvent>;
  events?: Partial<SimulatorEvent>[];
}
