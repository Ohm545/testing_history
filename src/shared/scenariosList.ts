import { ScenarioMetadata } from './types';

export const ALL_SCENARIOS_METADATA: ScenarioMetadata[] = [
  // IDENTITY (8)
  {
    id: 'identity-resolution',
    name: 'Cross-Channel Identity Resolution',
    description: 'Anonymous website visitor logs in and later interacts through mobile and support channels.',
    category: 'identity',
    channels: ['web', 'mobile_app', 'call_center'],
    expectedEvents: 8,
    expectedOutcome: 'ANON-WEB-1001 → U-1001 → CUST-1001 stitched across web, mobile, and call center',
    iconName: 'Network',
    customer: {
      id: 'CUST-1001',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '9876500001'
    },
    explanation: 'Demonstrates deterministic identity resolution connecting an anonymous browser cookie to authenticated user and enterprise customer record across channels.',
    identityGraphType: 'linear'
  },
  {
    id: 'anonymous-login',
    name: 'Anonymous → Login',
    description: 'Pre-login anonymous session events are retrospectively associated with the user after authentication.',
    category: 'identity',
    channels: ['web'],
    expectedEvents: 6,
    expectedOutcome: 'Retrospective attribution of SES-WEB-1002 events to U-1002 / CUST-1002',
    iconName: 'LogIn',
    customer: {
      id: 'CUST-1002',
      name: 'Ananya Roy',
      email: 'ananya.roy@example.com'
    },
    explanation: 'Events before login have customer_id=null, but share session SES-WEB-1002. Once login occurs, downstream engines retrospectively bind all past actions.',
    identityGraphType: 'linear'
  },
  {
    id: 'identity-ambiguity',
    name: 'Ambiguous Identity',
    description: 'Weak identifier (common customer name) with multiple candidate matches and no hard disambiguator.',
    category: 'identity',
    channels: ['call_center', 'physical_store'],
    expectedEvents: 2,
    expectedOutcome: 'status: AMBIGUOUS, confidence: LOW, candidates: [CUST-1003, CUST-1004]',
    iconName: 'HelpCircle',
    explanation: 'Name alone is weak evidence. The system intentionally retains AMBIGUOUS status instead of falsely merging or picking an arbitrary profile.',
    identityGraphType: 'ambiguous'
  },
  {
    id: 'identity-conflict',
    name: 'Identity Conflict',
    description: 'Incoming event provides contradictory evidence: phone belongs to Customer A, but order belongs to Customer B.',
    category: 'identity',
    channels: ['call_center'],
    expectedEvents: 1,
    expectedOutcome: 'status: CONFLICT, Candidate 1: CUST-1005 (Phone), Candidate 2: CUST-1006 (Order)',
    iconName: 'AlertTriangle',
    explanation: 'Preserves conflicting evidence rather than overwriting or picking a winner. Allows downstream investigation.',
    identityGraphType: 'conflict'
  },
  {
    id: 'shared-browser',
    name: 'Shared Browser',
    description: 'Single anonymous cookie appears across two different sessions with two different authenticated customers.',
    category: 'identity',
    channels: ['web'],
    expectedEvents: 6,
    expectedOutcome: 'ANON-SHARED-01 + SES-SHARED-01 → CUST-1013; ANON-SHARED-01 + SES-SHARED-02 → CUST-1014',
    iconName: 'Users',
    explanation: 'Proves why naive systems that permanently bind cookies to a single person fail. Identity graphs must be session-aware.',
    identityGraphType: 'shared_browser'
  },
  {
    id: 'multiple-phone',
    name: 'Multiple Phone Numbers',
    description: 'Single customer interacts using primary and secondary phone numbers, resolving to one master profile.',
    category: 'identity',
    channels: ['web', 'call_center', 'mobile_app'],
    expectedEvents: 4,
    expectedOutcome: 'Primary (9876500015) & Secondary (9876500099) both resolve to CUST-1015',
    iconName: 'Smartphone',
    customer: {
      id: 'CUST-1015',
      name: 'Rohan Gupta',
      phone: '9876500015'
    },
    explanation: 'Demonstrates 1:N phone number mapping. The identity resolution platform does not treat a phone number as an immutable 1:1 person proxy.',
    identityGraphType: 'multiple_phone'
  },
  {
    id: 'unresolved',
    name: 'Unresolved Identity',
    description: 'Event with no customer, user, email, phone, or order identifiers. Remains correctly UNRESOLVED.',
    category: 'identity',
    channels: ['web'],
    expectedEvents: 2,
    expectedOutcome: 'status: UNRESOLVED (No customer assignment forced)',
    iconName: 'ShieldAlert',
    explanation: 'System must not hallucinate or force customers into arbitrary records when zero verifiable proof exists.',
    identityGraphType: 'unresolved'
  },
  {
    id: 'retrospective-resolution',
    name: 'Retrospective Resolution',
    description: 'Browsing events occur before login, and are retrospectively resolved to Customer 1017 upon later login.',
    category: 'identity',
    channels: ['web'],
    expectedEvents: 5,
    expectedOutcome: 'Retrospective linking of anonymous events to U-1017 / CUST-1017',
    iconName: 'History',
    customer: {
      id: 'CUST-1017',
      name: 'Tanvi Shah',
      email: 'tanvi.shah@example.com'
    },
    explanation: 'Ensures marketing attribution engines credit initial top-of-funnel browsing to the user even if they logged in minutes later.',
    identityGraphType: 'linear'
  },

  // JOURNEY INTELLIGENCE (5)
  {
    id: 'checkout-dropoff',
    name: 'Checkout Drop-off',
    description: 'Customer progresses from product view to checkout, but leaves before completing purchase.',
    category: 'journey',
    channels: ['web'],
    expectedEvents: 4,
    expectedOutcome: 'Checkout Abandonment detected (Purchase event missing)',
    iconName: 'ShoppingCart',
    customer: {
      id: 'CUST-1010',
      name: 'Karan Mehra'
    },
    explanation: 'Downstream journey analytics can trigger automated cart abandonment campaigns or winback sequences.',
    identityGraphType: 'linear'
  },
  {
    id: 'payment-failure',
    name: 'Payment Failure Drop-off',
    description: 'Customer initiates checkout and attempts payment, but the bank declines and the journey halts.',
    category: 'journey',
    channels: ['web'],
    expectedEvents: 5,
    expectedOutcome: 'Payment Declined Drop-off (reason: bank_declined)',
    iconName: 'CreditCard',
    customer: {
      id: 'CUST-1009',
      name: 'Tara Joshi'
    },
    explanation: 'Enables real-time intervention such as SMS with alternate payment links or proactive customer care.',
    identityGraphType: 'linear'
  },
  {
    id: 'call-center-escalation',
    name: 'Call Center Escalation',
    description: 'Support contact followed by unresolved repeat call triggers priority escalation.',
    category: 'journey',
    channels: ['call_center'],
    expectedEvents: 4,
    expectedOutcome: 'Support Contact → Issue Unresolved → Repeat Contact → Escalation (Priority High)',
    iconName: 'PhoneCall',
    customer: {
      id: 'CUST-1011',
      name: 'Aditya Sen',
      phone: '9876500011'
    },
    explanation: 'Highlights customer frustration and enables automatic supervisor alert before churn occurs.',
    identityGraphType: 'linear'
  },
  {
    id: 'repeat-contact',
    name: 'Repeat Contact',
    description: 'Customer initiates three separate calls within a short timeframe for the same delivery delay issue.',
    category: 'journey',
    channels: ['call_center'],
    expectedEvents: 3,
    expectedOutcome: 'Repeat Contact pattern detected (3 calls on ORD-5012: CALL-001, CALL-002, CALL-003)',
    iconName: 'RotateCcw',
    customer: {
      id: 'CUST-1012',
      name: 'Sunita Rao',
      phone: '9876500012'
    },
    explanation: 'High contact frequency on a single order flags customer at immediate risk of churn or negative review.',
    identityGraphType: 'linear'
  },
  {
    id: 'churn-associated',
    name: 'Churn-Associated Journey',
    description: 'Failure chain: Payment failure → Support call → Repeat call → Escalation → No purchase.',
    category: 'journey',
    channels: ['web', 'call_center'],
    expectedEvents: 8,
    expectedOutcome: 'Pattern identified: "Churn-associated pattern" (High-risk friction loop)',
    iconName: 'UserX',
    customer: {
      id: 'CUST-1018',
      name: 'Kabir Varma',
      phone: '9876500018'
    },
    explanation: 'Correlates friction across checkout and support channels into a composite journey health score.',
    identityGraphType: 'linear'
  },

  // CHANNELS (2)
  {
    id: 'mobile-app',
    name: 'Mobile App Journey',
    description: 'End-to-end mobile application lifecycle including app open, cart additions, checkout, and purchase.',
    category: 'channels',
    channels: ['mobile_app'],
    expectedEvents: 6,
    expectedOutcome: 'Mobile conversion path completed (device: DEV-IOS-9941, order: ORD-MOB-2020)',
    iconName: 'Tablet',
    customer: {
      id: 'CUST-1020',
      name: 'Devika Nair'
    },
    explanation: 'Validates mobile telemetry parsing, hardware identifiers (IDFV/device_id), and native app in-app purchases.',
    identityGraphType: 'linear'
  },
  {
    id: 'physical-store',
    name: 'Physical Store',
    description: 'Offline store visit, consultation, and POS transaction linked to the customer omnichannel journey.',
    category: 'channels',
    channels: ['physical_store'],
    expectedEvents: 3,
    expectedOutcome: 'In-store POS transaction (TXN-88219) stitched to CUST-1016 profile',
    iconName: 'Store',
    customer: {
      id: 'CUST-1016',
      name: 'Meera Iyer',
      phone: '9876500016'
    },
    explanation: 'Bridges the gap between brick-and-mortar retail and digital identity systems using store ID, transaction ID, and phone.',
    identityGraphType: 'linear'
  }
];
