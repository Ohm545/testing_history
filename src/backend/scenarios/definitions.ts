import { ScenarioMetadata, SimulatorEvent, ScenarioResult } from '../../shared/types';

export interface ScenarioDefinition {
  metadata: ScenarioMetadata;
  generateEvents: (baseTime?: Date) => Partial<SimulatorEvent>[];
  analyze: (events: SimulatorEvent[]) => ScenarioResult;
}

// Helper to format ISO timestamp with offset in seconds
const addSeconds = (base: Date, seconds: number): string => {
  return new Date(base.getTime() + seconds * 1000).toISOString();
};

export const SCENARIOS: Record<string, ScenarioDefinition> = {
  // 1. Cross-Channel Identity Resolution
  'identity-resolution': {
    metadata: {
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
    generateEvents: (baseTime = new Date()) => [
      {
        channel: 'web',
        event_type: 'page_view',
        session_id: 'SES-WEB-1001',
        anonymous_id: 'ANON-WEB-1001',
        user_id: null,
        customer_id: null,
        timestamp: addSeconds(baseTime, 0),
        data: { url: '/products/flagship-electronics', referrer: 'https://google.com' },
        scenario_id: 'identity-resolution',
        identity_status: 'UNRESOLVED'
      },
      {
        channel: 'web',
        event_type: 'product_view',
        session_id: 'SES-WEB-1001',
        anonymous_id: 'ANON-WEB-1001',
        user_id: null,
        customer_id: null,
        timestamp: addSeconds(baseTime, 14),
        data: { product_name: 'UltraPhone Pro 15', product_id: 'PROD-9901', price: 899.99 },
        scenario_id: 'identity-resolution',
        identity_status: 'UNRESOLVED'
      },
      {
        channel: 'web',
        event_type: 'login',
        session_id: 'SES-WEB-1001',
        anonymous_id: 'ANON-WEB-1001',
        user_id: 'U-1001',
        customer_id: 'CUST-1001',
        email: 'rahul.sharma@example.com',
        phone: '9876500001',
        timestamp: addSeconds(baseTime, 35),
        data: { auth_method: 'password', customer_name: 'Rahul Sharma' },
        scenario_id: 'identity-resolution',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'web',
        event_type: 'add_to_cart',
        session_id: 'SES-WEB-1001',
        anonymous_id: 'ANON-WEB-1001',
        user_id: 'U-1001',
        customer_id: 'CUST-1001',
        timestamp: addSeconds(baseTime, 58),
        data: { product_name: 'UltraPhone Pro 15', quantity: 1, price: 899.99 },
        scenario_id: 'identity-resolution',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'web',
        event_type: 'purchase',
        session_id: 'SES-WEB-1001',
        anonymous_id: 'ANON-WEB-1001',
        user_id: 'U-1001',
        customer_id: 'CUST-1001',
        order_id: 'ORD-1001',
        timestamp: addSeconds(baseTime, 120),
        data: { order_id: 'ORD-1001', total_amount: 899.99, payment_type: 'visa_credit' },
        scenario_id: 'identity-resolution',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'mobile_app',
        event_type: 'mobile_app_open',
        session_id: 'SES-MOB-1001',
        anonymous_id: null,
        user_id: 'U-1001',
        customer_id: 'CUST-1001',
        device_id: 'DEV-MOB-1001',
        timestamp: addSeconds(baseTime, 450),
        data: { os: 'iOS 18.2', app_version: '4.12.0', device_model: 'iPhone 15' },
        scenario_id: 'identity-resolution',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'mobile_app',
        event_type: 'order_tracking',
        session_id: 'SES-MOB-1001',
        anonymous_id: null,
        user_id: 'U-1001',
        customer_id: 'CUST-1001',
        order_id: 'ORD-1001',
        device_id: 'DEV-MOB-1001',
        timestamp: addSeconds(baseTime, 485),
        data: { order_id: 'ORD-1001', tracking_status: 'In Transit', estimated_delivery: 'Tomorrow 2 PM' },
        scenario_id: 'identity-resolution',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'call_center',
        event_type: 'support_call',
        session_id: 'SES-CALL-1001',
        anonymous_id: null,
        user_id: null,
        customer_id: 'CUST-1001',
        phone: '9876500001',
        order_id: 'ORD-1001',
        timestamp: addSeconds(baseTime, 820),
        data: { ivr_selection: 'delivery_inquiry', agent_id: 'AGT-882', duration_sec: 140, customer_name: 'Rahul Sharma' },
        scenario_id: 'identity-resolution',
        identity_status: 'RESOLVED'
      }
    ],
    analyze: (events) => ({
      scenarioId: 'identity-resolution',
      name: 'Cross-Channel Identity Resolution',
      category: 'identity',
      eventsGenerated: events.length,
      detectedPattern: 'CROSS-CHANNEL STITCHING',
      identityStatus: 'RESOLVED',
      checklist: [
        { label: '8 events ingested into pipeline', status: 'checked' },
        { label: 'Anonymous cookie ANON-WEB-1001 captured', status: 'checked' },
        { label: 'Login resolved ANON-WEB-1001 → U-1001 → CUST-1001', status: 'checked' },
        { label: 'Mobile app session (DEV-MOB-1001) stitched via U-1001', status: 'checked' },
        { label: 'Call Center interaction linked via Phone (9876500001) and Order (ORD-1001)', status: 'checked' }
      ],
      explanation: 'Initial anonymous web events were stitched to user U-1001 and customer CUST-1001 upon login. Later mobile sessions and inbound IVR calls were successfully unified into the single unified customer profile.',
      identityGraphType: 'linear',
      graphNodes: [
        { id: 'anon', label: 'ANON-WEB-1001', type: 'anon', subtitle: 'Web Cookie' },
        { id: 'user', label: 'U-1001', type: 'user', subtitle: 'User ID' },
        { id: 'cust', label: 'CUST-1001', type: 'cust', subtitle: 'Rahul Sharma' },
        { id: 'dev', label: 'DEV-MOB-1001', type: 'evidence', subtitle: 'Mobile Device' },
        { id: 'phone', label: '+91 9876500001', type: 'evidence', subtitle: 'Call Center Phone' }
      ],
      graphEdges: [
        { from: 'anon', to: 'user', label: 'Login Auth' },
        { from: 'user', to: 'cust', label: 'Identity Stitched' },
        { from: 'dev', to: 'user', label: 'App Login' },
        { from: 'phone', to: 'cust', label: 'Verified Phone' }
      ]
    })
  },

  // 2. Anonymous -> Login
  'anonymous-login': {
    metadata: {
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
    generateEvents: (baseTime = new Date()) => [
      {
        channel: 'web',
        event_type: 'page_view',
        session_id: 'SES-WEB-1002',
        anonymous_id: 'ANON-WEB-1002',
        user_id: null,
        customer_id: null,
        timestamp: addSeconds(baseTime, 0),
        data: { url: '/catalog/smart-watches' },
        scenario_id: 'anonymous-login',
        identity_status: 'UNRESOLVED'
      },
      {
        channel: 'web',
        event_type: 'product_view',
        session_id: 'SES-WEB-1002',
        anonymous_id: 'ANON-WEB-1002',
        user_id: null,
        customer_id: null,
        timestamp: addSeconds(baseTime, 18),
        data: { product: 'Apex Smartwatch 4', price: 299.99 },
        scenario_id: 'anonymous-login',
        identity_status: 'UNRESOLVED'
      },
      {
        channel: 'web',
        event_type: 'add_to_cart',
        session_id: 'SES-WEB-1002',
        anonymous_id: 'ANON-WEB-1002',
        user_id: null,
        customer_id: null,
        timestamp: addSeconds(baseTime, 42),
        data: { product: 'Apex Smartwatch 4', quantity: 1 },
        scenario_id: 'anonymous-login',
        identity_status: 'UNRESOLVED'
      },
      {
        channel: 'web',
        event_type: 'login',
        session_id: 'SES-WEB-1002',
        anonymous_id: 'ANON-WEB-1002',
        user_id: 'U-1002',
        customer_id: 'CUST-1002',
        email: 'ananya.roy@example.com',
        timestamp: addSeconds(baseTime, 65),
        data: { auth_provider: 'google_oauth' },
        scenario_id: 'anonymous-login',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'web',
        event_type: 'checkout_started',
        session_id: 'SES-WEB-1002',
        anonymous_id: 'ANON-WEB-1002',
        user_id: 'U-1002',
        customer_id: 'CUST-1002',
        timestamp: addSeconds(baseTime, 88),
        data: { cart_total: 299.99 },
        scenario_id: 'anonymous-login',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'web',
        event_type: 'purchase',
        session_id: 'SES-WEB-1002',
        anonymous_id: 'ANON-WEB-1002',
        user_id: 'U-1002',
        customer_id: 'CUST-1002',
        order_id: 'ORD-1002',
        timestamp: addSeconds(baseTime, 140),
        data: { order_id: 'ORD-1002', payment_gateway: 'stripe' },
        scenario_id: 'anonymous-login',
        identity_status: 'RESOLVED'
      }
    ],
    analyze: (events) => ({
      scenarioId: 'anonymous-login',
      name: 'Anonymous → Login',
      category: 'identity',
      eventsGenerated: events.length,
      detectedPattern: 'RETROSPECTIVE SESSION RESOLUTION',
      identityStatus: 'RESOLVED',
      checklist: [
        { label: '3 pre-login anonymous events generated', status: 'checked' },
        { label: 'Session SES-WEB-1002 preserved across all 6 events', status: 'checked' },
        { label: 'Login event bound U-1002 and CUST-1002', status: 'checked' },
        { label: 'Previous browsing history retrospectively associated', status: 'checked' }
      ],
      explanation: 'Initial browsing occurred anonymously. Session continuity allows the identity graph to retrospectively associate earlier page/product views with CUST-1002.',
      identityGraphType: 'linear',
      graphNodes: [
        { id: 'anon', label: 'ANON-WEB-1002', type: 'anon', subtitle: 'Pre-auth Cookie' },
        { id: 'sess', label: 'SES-WEB-1002', type: 'session', subtitle: 'Continuous Session' },
        { id: 'user', label: 'U-1002', type: 'user', subtitle: 'Authenticated User' },
        { id: 'cust', label: 'CUST-1002', type: 'cust', subtitle: 'Ananya Roy' }
      ],
      graphEdges: [
        { from: 'anon', to: 'sess', label: 'Session Start' },
        { from: 'sess', to: 'user', label: 'Login (Step 4)' },
        { from: 'user', to: 'cust', label: 'Resolved Profile' }
      ]
    })
  },

  // 3. Ambiguous Identity
  'identity-ambiguity': {
    metadata: {
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
    generateEvents: (baseTime = new Date()) => [
      {
        channel: 'call_center',
        event_type: 'support_call',
        session_id: 'SES-CALL-1003',
        anonymous_id: null,
        user_id: null,
        customer_id: null,
        timestamp: addSeconds(baseTime, 0),
        data: {
          caller_name: 'Amit Patel',
          inquiry: 'General store hours & catalog inquiry',
          note: 'Caller did not provide phone number or customer ID'
        },
        scenario_id: 'identity-ambiguity',
        identity_status: 'AMBIGUOUS',
        confidence: 'LOW',
        candidates: ['CUST-1003 (Amit Patel - Mumbai)', 'CUST-1004 (Amit Patel - Ahmedabad)']
      },
      {
        channel: 'physical_store',
        event_type: 'product_consultation',
        session_id: 'SES-STR-1003',
        anonymous_id: null,
        user_id: null,
        customer_id: null,
        timestamp: addSeconds(baseTime, 120),
        data: {
          customer_name: 'Amit Patel',
          store_id: 'STR-MUMBAI-01',
          consultant: 'Rajesh K.',
          topic: 'High-end audio systems'
        },
        scenario_id: 'identity-ambiguity',
        identity_status: 'AMBIGUOUS',
        confidence: 'LOW',
        candidates: ['CUST-1003 (Amit Patel - Mumbai)', 'CUST-1004 (Amit Patel - Ahmedabad)']
      }
    ],
    analyze: (events) => ({
      scenarioId: 'identity-ambiguity',
      name: 'Ambiguous Identity',
      category: 'identity',
      eventsGenerated: events.length,
      detectedPattern: 'IDENTITY AMBIGUITY DETECTED',
      identityStatus: 'AMBIGUOUS',
      checklist: [
        { label: 'Event contains weak identifier: "Amit Patel"', status: 'checked' },
        { label: 'No strong deterministic key (phone, email, order ID)', status: 'warning' },
        { label: 'Two eligible candidates: CUST-1003 and CUST-1004', status: 'checked' },
        { label: 'Correctly marked status: AMBIGUOUS (Confidence: LOW)', status: 'checked' },
        { label: 'Did not falsely merge or pick arbitrary customer', status: 'checked' }
      ],
      explanation: 'Name alone is insufficient proof of identity. The simulator explicitly marks this interaction as AMBIGUOUS and lists both candidates without forcing a merge.',
      identityGraphType: 'ambiguous',
      graphNodes: [
        { id: 'evt', label: 'Event Evidence', type: 'ambiguous', subtitle: 'Name: "Amit Patel"' },
        { id: 'c1', label: 'CUST-1003', type: 'cust', subtitle: 'Amit Patel (Mumbai)' },
        { id: 'c2', label: 'CUST-1004', type: 'cust', subtitle: 'Amit Patel (Ahmedabad)' }
      ],
      graphEdges: [
        { from: 'evt', to: 'c1', label: 'Candidate 1 (50%)', dashed: true },
        { from: 'evt', to: 'c2', label: 'Candidate 2 (50%)', dashed: true }
      ]
    })
  },

  // 4. Identity Conflict
  'identity-conflict': {
    metadata: {
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
    generateEvents: (baseTime = new Date()) => [
      {
        channel: 'call_center',
        event_type: 'support_call',
        session_id: 'SES-CALL-CONFLICT-01',
        phone: '9876500010',
        order_id: 'ORD-9001',
        customer_id: null,
        timestamp: addSeconds(baseTime, 0),
        data: {
          caller_phone: '9876500010',
          provided_order_id: 'ORD-9001',
          evidence_conflict: {
            phone_owner: 'CUST-1005 (Priya Nair)',
            order_owner: 'CUST-1006 (Vikram Mehta)'
          },
          call_notes: 'Caller dialed from registered phone of Priya Nair but requested tracking for Vikram Mehta\'s order'
        },
        scenario_id: 'identity-conflict',
        identity_status: 'CONFLICT',
        confidence: 'LOW',
        candidates: ['CUST-1005 (Matched via Phone 9876500010)', 'CUST-1006 (Matched via Order ORD-9001)']
      }
    ],
    analyze: (events) => ({
      scenarioId: 'identity-conflict',
      name: 'Identity Conflict',
      category: 'identity',
      eventsGenerated: events.length,
      detectedPattern: 'CONTRADICTORY IDENTITY EVIDENCE',
      identityStatus: 'CONFLICT',
      checklist: [
        { label: 'Caller Phone: 9876500010 → Mapped to CUST-1005 (Priya Nair)', status: 'warning' },
        { label: 'Referenced Order: ORD-9001 → Mapped to CUST-1006 (Vikram Mehta)', status: 'warning' },
        { label: 'Conflict identified between two strong identifiers', status: 'checked' },
        { label: 'Both pieces of evidence preserved for audit', status: 'checked' },
        { label: 'Event flagged with status: CONFLICT', status: 'checked' }
      ],
      explanation: 'Contradictory evidence detected: Phone number 9876500010 belongs to CUST-1005, but Order ORD-9001 belongs to CUST-1006. The platform preserves both candidates and flags for manual or secondary validation.',
      identityGraphType: 'conflict',
      graphNodes: [
        { id: 'phone', label: 'Phone: 9876500010', type: 'evidence', subtitle: 'Verified Caller ID' },
        { id: 'order', label: 'Order: ORD-9001', type: 'evidence', subtitle: 'Verified Order Record' },
        { id: 'c1', label: 'CUST-1005', type: 'cust', subtitle: 'Priya Nair' },
        { id: 'c2', label: 'CUST-1006', type: 'cust', subtitle: 'Vikram Mehta' }
      ],
      graphEdges: [
        { from: 'phone', to: 'c1', label: 'Matches Record' },
        { from: 'order', to: 'c2', label: 'Matches Record' }
      ]
    })
  },

  // 5. Checkout Drop-off
  'checkout-dropoff': {
    metadata: {
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
    generateEvents: (baseTime = new Date()) => [
      {
        channel: 'web',
        event_type: 'page_view',
        session_id: 'SES-DROP-1010',
        anonymous_id: 'ANON-DROP-1010',
        customer_id: 'CUST-1010',
        timestamp: addSeconds(baseTime, 0),
        data: { url: '/store/laptops' },
        scenario_id: 'checkout-dropoff',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'web',
        event_type: 'product_view',
        session_id: 'SES-DROP-1010',
        anonymous_id: 'ANON-DROP-1010',
        customer_id: 'CUST-1010',
        timestamp: addSeconds(baseTime, 25),
        data: { product: 'MacBook Pro 16', price: 2499.00 },
        scenario_id: 'checkout-dropoff',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'web',
        event_type: 'add_to_cart',
        session_id: 'SES-DROP-1010',
        anonymous_id: 'ANON-DROP-1010',
        customer_id: 'CUST-1010',
        timestamp: addSeconds(baseTime, 48),
        data: { product: 'MacBook Pro 16', quantity: 1, price: 2499.00 },
        scenario_id: 'checkout-dropoff',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'web',
        event_type: 'checkout_started',
        session_id: 'SES-DROP-1010',
        anonymous_id: 'ANON-DROP-1010',
        customer_id: 'CUST-1010',
        timestamp: addSeconds(baseTime, 85),
        data: { checkout_step: 'shipping_address', subtotal: 2499.00 },
        scenario_id: 'checkout-dropoff',
        identity_status: 'RESOLVED'
      }
    ],
    analyze: (events) => ({
      scenarioId: 'checkout-dropoff',
      name: 'Checkout Drop-off',
      category: 'journey',
      eventsGenerated: events.length,
      detectedPattern: 'CHECKOUT DROP-OFF',
      identityStatus: 'RESOLVED',
      checklist: [
        { label: '4 sequential events generated', status: 'checked' },
        { label: 'Session SES-DROP-1010 active', status: 'checked' },
        { label: 'Checkout initiated at checkout_step: shipping_address', status: 'checked' },
        { label: 'Purchase event missing (Journey Abandonment)', status: 'warning' }
      ],
      explanation: 'Customer progressed through page view, product view, add to cart, and checkout start, but abruptly stopped before purchasing. Identified as high-value cart abandonment ($2,499.00).',
      identityGraphType: 'linear',
      graphNodes: [
        { id: 'n1', label: 'Product View', type: 'evidence', subtitle: 'MacBook Pro 16' },
        { id: 'n2', label: 'Add to Cart', type: 'evidence', subtitle: '$2,499.00' },
        { id: 'n3', label: 'Checkout Started', type: 'evidence', subtitle: 'Step: Shipping' },
        { id: 'n4', label: 'DROP-OFF', type: 'conflict', subtitle: 'No Purchase Recorded' }
      ],
      graphEdges: [
        { from: 'n1', to: 'n2' },
        { from: 'n2', to: 'n3' },
        { from: 'n3', to: 'n4', label: 'Abandoned', dashed: true }
      ]
    })
  },

  // 6. Payment Failure Drop-off
  'payment-failure': {
    metadata: {
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
    generateEvents: (baseTime = new Date()) => [
      {
        channel: 'web',
        event_type: 'product_view',
        session_id: 'SES-PAY-1009',
        customer_id: 'CUST-1009',
        timestamp: addSeconds(baseTime, 0),
        data: { product: 'Noise Cancelling Headphones', price: 349.99 },
        scenario_id: 'payment-failure',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'web',
        event_type: 'add_to_cart',
        session_id: 'SES-PAY-1009',
        customer_id: 'CUST-1009',
        timestamp: addSeconds(baseTime, 20),
        data: { product: 'Noise Cancelling Headphones', quantity: 1 },
        scenario_id: 'payment-failure',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'web',
        event_type: 'checkout_started',
        session_id: 'SES-PAY-1009',
        customer_id: 'CUST-1009',
        timestamp: addSeconds(baseTime, 45),
        data: { amount: 349.99 },
        scenario_id: 'payment-failure',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'web',
        event_type: 'payment_attempt',
        session_id: 'SES-PAY-1009',
        customer_id: 'CUST-1009',
        timestamp: addSeconds(baseTime, 65),
        data: { gateway: 'CyberSource', method: 'credit_card', card_network: 'MasterCard' },
        scenario_id: 'payment-failure',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'web',
        event_type: 'payment_failed',
        session_id: 'SES-PAY-1009',
        customer_id: 'CUST-1009',
        timestamp: addSeconds(baseTime, 72),
        data: { reason: 'bank_declined', error_code: 'ERR_CARD_DECLINED_BY_ISSUER', amount: 349.99 },
        scenario_id: 'payment-failure',
        identity_status: 'RESOLVED'
      }
    ],
    analyze: (events) => ({
      scenarioId: 'payment-failure',
      name: 'Payment Failure Drop-off',
      category: 'journey',
      eventsGenerated: events.length,
      detectedPattern: 'PAYMENT FAILURE DROP-OFF',
      identityStatus: 'RESOLVED',
      checklist: [
        { label: 'Customer attempted purchase ($349.99)', status: 'checked' },
        { label: 'Payment gateway rejected transaction', status: 'warning' },
        { label: 'Reason: bank_declined (Code: ERR_CARD_DECLINED_BY_ISSUER)', status: 'warning' },
        { label: 'Session terminated without retry', status: 'warning' }
      ],
      explanation: 'Customer encountered a critical friction point when their bank declined transaction authorization. Customer abandoned without attempting secondary payment.',
      identityGraphType: 'linear',
      graphNodes: [
        { id: 'co', label: 'Checkout Started', type: 'evidence' },
        { id: 'att', label: 'Payment Attempt', type: 'evidence' },
        { id: 'fail', label: 'Payment Failed', type: 'conflict', subtitle: 'bank_declined' },
        { id: 'drop', label: 'Journey Drop-off', type: 'ambiguous', subtitle: 'No Retry' }
      ],
      graphEdges: [
        { from: 'co', to: 'att' },
        { from: 'att', to: 'fail', label: 'Issuer Reject' },
        { from: 'fail', to: 'drop', dashed: true }
      ]
    })
  },

  // 7. Call Center Escalation
  'call-center-escalation': {
    metadata: {
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
    generateEvents: (baseTime = new Date()) => [
      {
        channel: 'call_center',
        event_type: 'support_call',
        session_id: 'SES-CALL-7011A',
        customer_id: 'CUST-1011',
        phone: '9876500011',
        timestamp: addSeconds(baseTime, 0),
        data: { priority: 'normal', caller_sentiment: 'neutral', issue: 'Missing package delivery' },
        scenario_id: 'call-center-escalation',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'call_center',
        event_type: 'support_case_created',
        session_id: 'SES-CALL-7011A',
        customer_id: 'CUST-1011',
        phone: '9876500011',
        order_id: 'ORD-5011',
        case_id: 'CASE-7011',
        timestamp: addSeconds(baseTime, 120),
        data: { case_type: 'delivery_escalation', sla_hours: 48, priority: 'normal' },
        scenario_id: 'call-center-escalation',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'call_center',
        event_type: 'support_call',
        session_id: 'SES-CALL-7011B',
        customer_id: 'CUST-1011',
        phone: '9876500011',
        order_id: 'ORD-5011',
        case_id: 'CASE-7011',
        timestamp: addSeconds(baseTime, 3600),
        data: { issue_not_resolved: true, caller_sentiment: 'frustrated', note: 'Customer called back: still no tracking update' },
        scenario_id: 'call-center-escalation',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'call_center',
        event_type: 'case_escalated',
        session_id: 'SES-CALL-7011B',
        customer_id: 'CUST-1011',
        phone: '9876500011',
        case_id: 'CASE-7011',
        timestamp: addSeconds(baseTime, 3750),
        data: { priority: 'high', escalated_to: 'Tier-2 Support Supervisor', reason: 'Repeated contact within SLA with zero resolution' },
        scenario_id: 'call-center-escalation',
        identity_status: 'RESOLVED'
      }
    ],
    analyze: (events) => ({
      scenarioId: 'call-center-escalation',
      name: 'Call Center Escalation',
      category: 'journey',
      eventsGenerated: events.length,
      detectedPattern: 'CALL CENTER ESCALATION',
      identityStatus: 'RESOLVED',
      checklist: [
        { label: 'First contact: CASE-7011 created with normal priority', status: 'checked' },
        { label: 'Second contact received within SLA window', status: 'warning' },
        { label: 'Flag issue_not_resolved = true triggered', status: 'warning' },
        { label: 'Case escalated to Tier-2 Supervisor with priority: HIGH', status: 'checked' }
      ],
      explanation: 'Customer reached out twice regarding missing delivery ORD-5011. The unresolved second contact automatically triggered an escalation to high priority.',
      identityGraphType: 'linear',
      graphNodes: [
        { id: 'c1', label: 'Support Call 1', type: 'evidence', subtitle: 'Normal Priority' },
        { id: 'case', label: 'CASE-7011', type: 'evidence', subtitle: 'ORD-5011' },
        { id: 'c2', label: 'Support Call 2', type: 'conflict', subtitle: 'issue_not_resolved: true' },
        { id: 'esc', label: 'Case Escalated', type: 'cust', subtitle: 'Priority: HIGH' }
      ],
      graphEdges: [
        { from: 'c1', to: 'case' },
        { from: 'case', to: 'c2', label: 'Follow-up' },
        { from: 'c2', to: 'esc', label: 'Escalation Trigger' }
      ]
    })
  },

  // 8. Repeat Contact
  'repeat-contact': {
    metadata: {
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
    generateEvents: (baseTime = new Date()) => [
      {
        channel: 'call_center',
        event_type: 'support_call',
        session_id: 'SES-CALL-001',
        customer_id: 'CUST-1012',
        phone: '9876500012',
        order_id: 'ORD-5012',
        timestamp: addSeconds(baseTime, 0),
        data: { call_id: 'CALL-001', duration_sec: 240, issue: 'delivery_delay', customer_mood: 'neutral' },
        scenario_id: 'repeat-contact',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'call_center',
        event_type: 'support_call',
        session_id: 'SES-CALL-002',
        customer_id: 'CUST-1012',
        phone: '9876500012',
        order_id: 'ORD-5012',
        timestamp: addSeconds(baseTime, 1800),
        data: { call_id: 'CALL-002', duration_sec: 310, issue: 'delivery_delay', repeat_count: 2, customer_mood: 'concerned' },
        scenario_id: 'repeat-contact',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'call_center',
        event_type: 'support_call',
        session_id: 'SES-CALL-003',
        customer_id: 'CUST-1012',
        phone: '9876500012',
        order_id: 'ORD-5012',
        timestamp: addSeconds(baseTime, 4200),
        data: { call_id: 'CALL-003', duration_sec: 450, issue: 'delivery_delay', repeat_count: 3, customer_mood: 'angry' },
        scenario_id: 'repeat-contact',
        identity_status: 'RESOLVED'
      }
    ],
    analyze: (events) => ({
      scenarioId: 'repeat-contact',
      name: 'Repeat Contact',
      category: 'journey',
      eventsGenerated: events.length,
      detectedPattern: 'REPEAT CONTACT DETECTED',
      identityStatus: 'RESOLVED',
      checklist: [
        { label: '3 calls registered: CALL-001, CALL-002, CALL-003', status: 'checked' },
        { label: 'All calls reference identical customer CUST-1012 and order ORD-5012', status: 'checked' },
        { label: 'Customer sentiment deteriorated from neutral to angry', status: 'warning' },
        { label: 'Repeat contact threshold exceeded (>2 within 2 hours)', status: 'warning' }
      ],
      explanation: 'Customer phoned support three times concerning the same order delay. This repeat interaction pattern signifies acute friction requiring immediate customer success outreach.',
      identityGraphType: 'linear',
      graphNodes: [
        { id: 'c1', label: 'CALL-001', type: 'evidence', subtitle: 'First inquiry' },
        { id: 'c2', label: 'CALL-002', type: 'evidence', subtitle: 'Second inquiry (+30m)' },
        { id: 'c3', label: 'CALL-003', type: 'conflict', subtitle: 'Third inquiry (+70m)' },
        { id: 'cust', label: 'CUST-1012', type: 'cust', subtitle: 'Sunita Rao' }
      ],
      graphEdges: [
        { from: 'c1', to: 'cust' },
        { from: 'c2', to: 'cust' },
        { from: 'c3', to: 'cust' }
      ]
    })
  },

  // 9. Shared Browser
  'shared-browser': {
    metadata: {
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
    generateEvents: (baseTime = new Date()) => [
      // Session 1: Aarav Patel (CUST-1013)
      {
        channel: 'web',
        event_type: 'page_view',
        session_id: 'SES-SHARED-01',
        anonymous_id: 'ANON-SHARED-01',
        user_id: null,
        customer_id: null,
        timestamp: addSeconds(baseTime, 0),
        data: { url: '/gadgets' },
        scenario_id: 'shared-browser',
        identity_status: 'UNRESOLVED'
      },
      {
        channel: 'web',
        event_type: 'login',
        session_id: 'SES-SHARED-01',
        anonymous_id: 'ANON-SHARED-01',
        user_id: 'U-1013',
        customer_id: 'CUST-1013',
        email: 'aarav.patel@example.com',
        timestamp: addSeconds(baseTime, 25),
        data: { customer_name: 'Aarav Patel' },
        scenario_id: 'shared-browser',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'web',
        event_type: 'purchase',
        session_id: 'SES-SHARED-01',
        anonymous_id: 'ANON-SHARED-01',
        user_id: 'U-1013',
        customer_id: 'CUST-1013',
        order_id: 'ORD-SH1',
        timestamp: addSeconds(baseTime, 60),
        data: { item: 'Wireless Keyboard', amount: 89.00 },
        scenario_id: 'shared-browser',
        identity_status: 'RESOLVED'
      },

      // Session 2: Sneha Verma (CUST-1014) on same browser/machine
      {
        channel: 'web',
        event_type: 'page_view',
        session_id: 'SES-SHARED-02',
        anonymous_id: 'ANON-SHARED-01',
        user_id: null,
        customer_id: null,
        timestamp: addSeconds(baseTime, 3600),
        data: { url: '/apparel' },
        scenario_id: 'shared-browser',
        identity_status: 'UNRESOLVED'
      },
      {
        channel: 'web',
        event_type: 'login',
        session_id: 'SES-SHARED-02',
        anonymous_id: 'ANON-SHARED-01',
        user_id: 'U-1014',
        customer_id: 'CUST-1014',
        email: 'sneha.verma@example.com',
        timestamp: addSeconds(baseTime, 3630),
        data: { customer_name: 'Sneha Verma' },
        scenario_id: 'shared-browser',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'web',
        event_type: 'purchase',
        session_id: 'SES-SHARED-02',
        anonymous_id: 'ANON-SHARED-01',
        user_id: 'U-1014',
        customer_id: 'CUST-1014',
        order_id: 'ORD-SH2',
        timestamp: addSeconds(baseTime, 3680),
        data: { item: 'Running Shoes', amount: 120.00 },
        scenario_id: 'shared-browser',
        identity_status: 'RESOLVED'
      }
    ],
    analyze: (events) => ({
      scenarioId: 'shared-browser',
      name: 'Shared Browser',
      category: 'identity',
      eventsGenerated: events.length,
      detectedPattern: 'SHARED DEVICE / MULTI-TENANT SESSION RESOLUTION',
      identityStatus: 'RESOLVED',
      checklist: [
        { label: 'Same anonymous cookie ANON-SHARED-01 shared across sessions', status: 'checked' },
        { label: 'Session 1 (SES-SHARED-01) resolved to CUST-1013 (Aarav Patel)', status: 'checked' },
        { label: 'Session 2 (SES-SHARED-02) resolved to CUST-1014 (Sneha Verma)', status: 'checked' },
        { label: 'Prevented permanent cookie-to-person binding corruption', status: 'checked' }
      ],
      explanation: 'The same browser was used by two different family members. Because identity resolution is session-aware, ANON-SHARED-01 correctly points to CUST-1013 in Session 1 and to CUST-1014 in Session 2.',
      identityGraphType: 'shared_browser',
      graphNodes: [
        { id: 'anon', label: 'ANON-SHARED-01', type: 'anon', subtitle: 'Shared Cookie' },
        { id: 'ses1', label: 'SES-SHARED-01', type: 'session', subtitle: 'Session 1 (10:00 AM)' },
        { id: 'ses2', label: 'SES-SHARED-02', type: 'session', subtitle: 'Session 2 (11:00 AM)' },
        { id: 'cust1', label: 'CUST-1013', type: 'cust', subtitle: 'Aarav Patel' },
        { id: 'cust2', label: 'CUST-1014', type: 'cust', subtitle: 'Sneha Verma' }
      ],
      graphEdges: [
        { from: 'anon', to: 'ses1', label: 'Session 1' },
        { from: 'anon', to: 'ses2', label: 'Session 2' },
        { from: 'ses1', to: 'cust1', label: 'Logged In' },
        { from: 'ses2', to: 'cust2', label: 'Logged In' }
      ]
    })
  },

  // 10. Multiple Phone Numbers
  'multiple-phone': {
    metadata: {
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
    generateEvents: (baseTime = new Date()) => [
      {
        channel: 'web',
        event_type: 'login',
        session_id: 'SES-PH-1',
        customer_id: 'CUST-1015',
        phone: '9876500015',
        timestamp: addSeconds(baseTime, 0),
        data: { customer_name: 'Rohan Gupta', phone_role: 'primary' },
        scenario_id: 'multiple-phone',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'call_center',
        event_type: 'support_call',
        session_id: 'SES-CALL-PH1',
        customer_id: 'CUST-1015',
        phone: '9876500015',
        timestamp: addSeconds(baseTime, 120),
        data: { caller_id: '9876500015', call_topic: 'Order status check' },
        scenario_id: 'multiple-phone',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'call_center',
        event_type: 'support_call',
        session_id: 'SES-CALL-PH2',
        customer_id: 'CUST-1015',
        phone: '9876500099',
        timestamp: addSeconds(baseTime, 600),
        data: { caller_id: '9876500099', note: 'Customer called from alternate work phone, OTP verified' },
        scenario_id: 'multiple-phone',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'mobile_app',
        event_type: 'order_tracking',
        session_id: 'SES-MOB-PH',
        customer_id: 'CUST-1015',
        phone: '9876500099',
        device_id: 'DEV-PH-99',
        timestamp: addSeconds(baseTime, 720),
        data: { app_action: 'tracked_shipment', phone_used: '9876500099' },
        scenario_id: 'multiple-phone',
        identity_status: 'RESOLVED'
      }
    ],
    analyze: (events) => ({
      scenarioId: 'multiple-phone',
      name: 'Multiple Phone Numbers',
      category: 'identity',
      eventsGenerated: events.length,
      detectedPattern: 'MULTI-PHONE IDENTITY GRAPH RESOLUTION',
      identityStatus: 'RESOLVED',
      checklist: [
        { label: 'Primary phone registered: 9876500015', status: 'checked' },
        { label: 'Secondary phone registered: 9876500099', status: 'checked' },
        { label: 'Both phone numbers successfully stitched to CUST-1015', status: 'checked' },
        { label: 'Does not split Rohan Gupta into two separate customers', status: 'checked' }
      ],
      explanation: 'Customer Rohan Gupta uses both personal and office phone numbers. The system maintains a multi-identifier graph where both phone numbers resolve to CUST-1015.',
      identityGraphType: 'multiple_phone',
      graphNodes: [
        { id: 'p1', label: '+91 9876500015', type: 'evidence', subtitle: 'Primary Phone' },
        { id: 'p2', label: '+91 9876500099', type: 'evidence', subtitle: 'Secondary Phone' },
        { id: 'cust', label: 'CUST-1015', type: 'cust', subtitle: 'Rohan Gupta' }
      ],
      graphEdges: [
        { from: 'p1', to: 'cust', label: 'Primary Owner' },
        { from: 'p2', to: 'cust', label: 'Alternate Phone' }
      ]
    })
  },

  // 11. Physical Store
  'physical-store': {
    metadata: {
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
    },
    generateEvents: (baseTime = new Date()) => [
      {
        channel: 'physical_store',
        event_type: 'store_visit',
        session_id: 'SES-STR-88219',
        customer_id: null,
        timestamp: addSeconds(baseTime, 0),
        data: { store_id: 'STORE-MUMBAI-04', beacon_id: 'BCN-ENTRANCE-02', department: 'Premium Audio' },
        scenario_id: 'physical-store',
        identity_status: 'UNRESOLVED'
      },
      {
        channel: 'physical_store',
        event_type: 'product_consultation',
        session_id: 'SES-STR-88219',
        customer_id: 'CUST-1016',
        phone: '9876500016',
        timestamp: addSeconds(baseTime, 600),
        data: { store_id: 'STORE-MUMBAI-04', associate_id: 'ASSOC-402', product_discussed: 'Sonos Arc Soundbar' },
        scenario_id: 'physical-store',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'physical_store',
        event_type: 'store_purchase',
        session_id: 'SES-STR-88219',
        customer_id: 'CUST-1016',
        phone: '9876500016',
        timestamp: addSeconds(baseTime, 1200),
        data: {
          store_id: 'STORE-MUMBAI-04',
          transaction_id: 'TXN-88219',
          amount: 1249.00,
          payment_method: 'POS_CARD_TERMINAL_7',
          loyalty_points_earned: 124
        },
        scenario_id: 'physical-store',
        identity_status: 'RESOLVED'
      }
    ],
    analyze: (events) => ({
      scenarioId: 'physical-store',
      name: 'Physical Store',
      category: 'channels',
      eventsGenerated: events.length,
      detectedPattern: 'OMNICHANNEL STORE TO DIGITAL STITCHING',
      identityStatus: 'RESOLVED',
      checklist: [
        { label: 'Store visit recorded at STORE-MUMBAI-04', status: 'checked' },
        { label: 'Product consultation matched via phone: 9876500016', status: 'checked' },
        { label: 'POS transaction TXN-88219 ($1,249.00) completed', status: 'checked' },
        { label: 'In-store activity integrated into omnichannel customer timeline', status: 'checked' }
      ],
      explanation: 'Customer Meera Iyer visited the physical retail location. Interaction with the sales associate and POS terminal was stitched to her unified profile using store and transaction IDs.',
      identityGraphType: 'linear',
      graphNodes: [
        { id: 'bcn', label: 'STORE-MUMBAI-04', type: 'evidence', subtitle: 'Store Beacon' },
        { id: 'txn', label: 'TXN-88219', type: 'evidence', subtitle: 'POS Terminal' },
        { id: 'ph', label: '+91 9876500016', type: 'evidence', subtitle: 'Phone at Register' },
        { id: 'cust', label: 'CUST-1016', type: 'cust', subtitle: 'Meera Iyer' }
      ],
      graphEdges: [
        { from: 'bcn', to: 'txn', label: 'In-store Journey' },
        { from: 'txn', to: 'ph', label: 'Receipt SMS' },
        { from: 'ph', to: 'cust', label: 'Resolved Customer' }
      ]
    })
  },

  // 12. Mobile App Journey
  'mobile-app': {
    metadata: {
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
    generateEvents: (baseTime = new Date()) => [
      {
        channel: 'mobile_app',
        event_type: 'app_open',
        session_id: 'SES-MOB-9941',
        anonymous_id: 'ANON-MOB-9941',
        device_id: 'DEV-IOS-9941',
        customer_id: 'CUST-1020',
        user_id: 'U-1020',
        timestamp: addSeconds(baseTime, 0),
        data: { app_version: '5.2.0', os_version: 'iOS 18.1', screen: 'home_feed' },
        scenario_id: 'mobile-app',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'mobile_app',
        event_type: 'product_view',
        session_id: 'SES-MOB-9941',
        anonymous_id: 'ANON-MOB-9941',
        device_id: 'DEV-IOS-9941',
        customer_id: 'CUST-1020',
        user_id: 'U-1020',
        timestamp: addSeconds(baseTime, 22),
        data: { product: 'Smart Fitness Tracker Band', price: 154.50 },
        scenario_id: 'mobile-app',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'mobile_app',
        event_type: 'add_to_cart',
        session_id: 'SES-MOB-9941',
        anonymous_id: 'ANON-MOB-9941',
        device_id: 'DEV-IOS-9941',
        customer_id: 'CUST-1020',
        user_id: 'U-1020',
        timestamp: addSeconds(baseTime, 45),
        data: { product: 'Smart Fitness Tracker Band', quantity: 1 },
        scenario_id: 'mobile-app',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'mobile_app',
        event_type: 'checkout_started',
        session_id: 'SES-MOB-9941',
        anonymous_id: 'ANON-MOB-9941',
        device_id: 'DEV-IOS-9941',
        customer_id: 'CUST-1020',
        user_id: 'U-1020',
        timestamp: addSeconds(baseTime, 70),
        data: { cart_value: 154.50, shipping_method: 'next_day_air' },
        scenario_id: 'mobile-app',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'mobile_app',
        event_type: 'payment_attempt',
        session_id: 'SES-MOB-9941',
        anonymous_id: 'ANON-MOB-9941',
        device_id: 'DEV-IOS-9941',
        customer_id: 'CUST-1020',
        user_id: 'U-1020',
        timestamp: addSeconds(baseTime, 92),
        data: { payment_rail: 'Apple Pay' },
        scenario_id: 'mobile-app',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'mobile_app',
        event_type: 'purchase',
        session_id: 'SES-MOB-9941',
        anonymous_id: 'ANON-MOB-9941',
        device_id: 'DEV-IOS-9941',
        customer_id: 'CUST-1020',
        user_id: 'U-1020',
        order_id: 'ORD-MOB-2020',
        timestamp: addSeconds(baseTime, 115),
        data: { order_id: 'ORD-MOB-2020', total: 154.50, status: 'confirmed' },
        scenario_id: 'mobile-app',
        identity_status: 'RESOLVED'
      }
    ],
    analyze: (events) => ({
      scenarioId: 'mobile-app',
      name: 'Mobile App Journey',
      category: 'channels',
      eventsGenerated: events.length,
      detectedPattern: 'MOBILE NATIVE APP CONVERSION',
      identityStatus: 'RESOLVED',
      checklist: [
        { label: '6 native mobile events captured', status: 'checked' },
        { label: 'Hardware device DEV-IOS-9941 linked to user U-1020', status: 'checked' },
        { label: 'In-app Apple Pay payment completed', status: 'checked' },
        { label: 'Purchase ORD-MOB-2020 successfully attributed', status: 'checked' }
      ],
      explanation: 'Complete native mobile app interaction flow tracked seamlessly with device telemetry and successful Apple Pay conversion.',
      identityGraphType: 'linear',
      graphNodes: [
        { id: 'dev', label: 'DEV-IOS-9941', type: 'evidence', subtitle: 'iPhone 15 Pro' },
        { id: 'user', label: 'U-1020', type: 'user', subtitle: 'Mobile User' },
        { id: 'cust', label: 'CUST-1020', type: 'cust', subtitle: 'Devika Nair' },
        { id: 'ord', label: 'ORD-MOB-2020', type: 'evidence', subtitle: 'Apple Pay Order' }
      ],
      graphEdges: [
        { from: 'dev', to: 'user' },
        { from: 'user', to: 'cust' },
        { from: 'cust', to: 'ord' }
      ]
    })
  },

  // 13. Unresolved Identity
  'unresolved': {
    metadata: {
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
    generateEvents: (baseTime = new Date()) => [
      {
        channel: 'web',
        event_type: 'page_view',
        session_id: 'SES-UNRES-01',
        anonymous_id: 'ANON-UNKNOWN-999',
        device_id: 'DEV-UNKNOWN',
        user_id: null,
        customer_id: null,
        email: null,
        phone: null,
        order_id: null,
        account_id: null,
        timestamp: addSeconds(baseTime, 0),
        data: { url: '/terms-and-conditions', user_agent: 'Mozilla/5.0 Unknown' },
        scenario_id: 'unresolved',
        identity_status: 'UNRESOLVED'
      },
      {
        channel: 'web',
        event_type: 'product_view',
        session_id: 'SES-UNRES-01',
        anonymous_id: 'ANON-UNKNOWN-999',
        device_id: 'DEV-UNKNOWN',
        user_id: null,
        customer_id: null,
        email: null,
        phone: null,
        order_id: null,
        account_id: null,
        timestamp: addSeconds(baseTime, 40),
        data: { product: 'Public Documentation Page' },
        scenario_id: 'unresolved',
        identity_status: 'UNRESOLVED'
      }
    ],
    analyze: (events) => ({
      scenarioId: 'unresolved',
      name: 'Unresolved Identity',
      category: 'identity',
      eventsGenerated: events.length,
      detectedPattern: 'ANONYMOUS UNRESOLVED IDENTITY',
      identityStatus: 'UNRESOLVED',
      checklist: [
        { label: 'Anonymous cookie ANON-UNKNOWN-999 captured', status: 'checked' },
        { label: 'No customer_id, user_id, email, or phone provided', status: 'warning' },
        { label: 'Correctly classified as UNRESOLVED', status: 'checked' },
        { label: 'No customer profile falsely created or linked', status: 'checked' }
      ],
      explanation: 'No verifiable identifiers are present in this session. The simulator accurately retains UNRESOLVED status without hallucinating a customer profile.',
      identityGraphType: 'unresolved',
      graphNodes: [
        { id: 'anon', label: 'ANON-UNKNOWN-999', type: 'anon', subtitle: 'Ephemeral Cookie' },
        { id: 'dev', label: 'DEV-UNKNOWN', type: 'evidence', subtitle: 'Unknown Browser' },
        { id: 'unres', label: 'UNRESOLVED', type: 'ambiguous', subtitle: 'No Matching Identity' }
      ],
      graphEdges: [
        { from: 'anon', to: 'unres', dashed: true },
        { from: 'dev', to: 'unres', dashed: true }
      ]
    })
  },

  // 14. Retrospective Resolution
  'retrospective-resolution': {
    metadata: {
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
    generateEvents: (baseTime = new Date()) => [
      {
        channel: 'web',
        event_type: 'page_view',
        session_id: 'SES-RETRO-1017',
        anonymous_id: 'ANON-RETRO-1017',
        customer_id: null,
        user_id: null,
        timestamp: addSeconds(baseTime, 0),
        data: { url: '/campaign/autumn-sale' },
        scenario_id: 'retrospective-resolution',
        identity_status: 'UNRESOLVED'
      },
      {
        channel: 'web',
        event_type: 'product_view',
        session_id: 'SES-RETRO-1017',
        anonymous_id: 'ANON-RETRO-1017',
        customer_id: null,
        user_id: null,
        timestamp: addSeconds(baseTime, 15),
        data: { product: 'Cashmere Winter Coat', price: 420.00 },
        scenario_id: 'retrospective-resolution',
        identity_status: 'UNRESOLVED'
      },
      {
        channel: 'web',
        event_type: 'add_to_cart',
        session_id: 'SES-RETRO-1017',
        anonymous_id: 'ANON-RETRO-1017',
        customer_id: null,
        user_id: null,
        timestamp: addSeconds(baseTime, 35),
        data: { product: 'Cashmere Winter Coat', quantity: 1 },
        scenario_id: 'retrospective-resolution',
        identity_status: 'UNRESOLVED'
      },
      {
        channel: 'web',
        event_type: 'login',
        session_id: 'SES-RETRO-1017',
        anonymous_id: 'ANON-RETRO-1017',
        user_id: 'U-1017',
        customer_id: 'CUST-1017',
        email: 'tanvi.shah@example.com',
        timestamp: addSeconds(baseTime, 60),
        data: { customer_name: 'Tanvi Shah' },
        scenario_id: 'retrospective-resolution',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'web',
        event_type: 'purchase',
        session_id: 'SES-RETRO-1017',
        anonymous_id: 'ANON-RETRO-1017',
        user_id: 'U-1017',
        customer_id: 'CUST-1017',
        order_id: 'ORD-1017',
        timestamp: addSeconds(baseTime, 95),
        data: { order_id: 'ORD-1017', total: 420.00 },
        scenario_id: 'retrospective-resolution',
        identity_status: 'RESOLVED'
      }
    ],
    analyze: (events) => ({
      scenarioId: 'retrospective-resolution',
      name: 'Retrospective Resolution',
      category: 'identity',
      eventsGenerated: events.length,
      detectedPattern: 'RETROSPECTIVE IDENTITY RESOLUTION',
      identityStatus: 'RESOLVED',
      checklist: [
        { label: '3 anonymous browsing events with customer_id = null', status: 'checked' },
        { label: 'Shared session SES-RETRO-1017 tracks full continuity', status: 'checked' },
        { label: 'Login identifies customer as Tanvi Shah (CUST-1017)', status: 'checked' },
        { label: 'Earlier events retrospectively stitched into journey timeline', status: 'checked' }
      ],
      explanation: 'First three events had no customer_id. Upon login in the same session, earlier events are retrospectively associated with CUST-1017 for 100% full-funnel attribution.',
      identityGraphType: 'linear',
      graphNodes: [
        { id: 'anon', label: 'ANON-RETRO-1017', type: 'anon', subtitle: 'Anonymous Cookie' },
        { id: 'ses', label: 'SES-RETRO-1017', type: 'session', subtitle: 'Same Session Window' },
        { id: 'cust', label: 'CUST-1017', type: 'cust', subtitle: 'Tanvi Shah' }
      ],
      graphEdges: [
        { from: 'anon', to: 'ses' },
        { from: 'ses', to: 'cust', label: 'Retrospective Stitch' }
      ]
    })
  },

  // 15. Churn-Associated Journey
  'churn-associated': {
    metadata: {
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
    generateEvents: (baseTime = new Date()) => [
      {
        channel: 'web',
        event_type: 'product_view',
        session_id: 'SES-CHURN-1018',
        customer_id: 'CUST-1018',
        timestamp: addSeconds(baseTime, 0),
        data: { product: 'Enterprise Server Rack 42U', price: 3890.00 },
        scenario_id: 'churn-associated',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'web',
        event_type: 'checkout_started',
        session_id: 'SES-CHURN-1018',
        customer_id: 'CUST-1018',
        timestamp: addSeconds(baseTime, 35),
        data: { amount: 3890.00 },
        scenario_id: 'churn-associated',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'web',
        event_type: 'payment_failed',
        session_id: 'SES-CHURN-1018',
        customer_id: 'CUST-1018',
        timestamp: addSeconds(baseTime, 55),
        data: { failure_reason: 'gateway_timeout_and_decline', code: 'GW_504_TIMEOUT' },
        scenario_id: 'churn-associated',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'call_center',
        event_type: 'support_call',
        session_id: 'SES-CALL-CH1',
        customer_id: 'CUST-1018',
        phone: '9876500018',
        timestamp: addSeconds(baseTime, 180),
        data: { topic: 'Payment failed but bank shows temporary hold', sentiment: 'anxious' },
        scenario_id: 'churn-associated',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'call_center',
        event_type: 'case_created',
        session_id: 'SES-CALL-CH1',
        customer_id: 'CUST-1018',
        case_id: 'CASE-CHURN-1018',
        timestamp: addSeconds(baseTime, 240),
        data: { category: 'billing_failure_inquiry', priority: 'medium' },
        scenario_id: 'churn-associated',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'call_center',
        event_type: 'second_support_call',
        session_id: 'SES-CALL-CH2',
        customer_id: 'CUST-1018',
        case_id: 'CASE-CHURN-1018',
        phone: '9876500018',
        timestamp: addSeconds(baseTime, 1800),
        data: { issue_not_resolved: true, sentiment: 'furious', note: 'Customer reports no response from billing department' },
        scenario_id: 'churn-associated',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'call_center',
        event_type: 'case_escalated',
        session_id: 'SES-CALL-CH2',
        customer_id: 'CUST-1018',
        case_id: 'CASE-CHURN-1018',
        timestamp: addSeconds(baseTime, 1950),
        data: { priority: 'high', reason: 'High-value client billing grievance' },
        scenario_id: 'churn-associated',
        identity_status: 'RESOLVED'
      },
      {
        channel: 'web',
        event_type: 'no_purchase',
        session_id: 'SES-CHURN-EXIT',
        customer_id: 'CUST-1018',
        timestamp: addSeconds(baseTime, 3600),
        data: { status: 'abandoned_cart_and_exit', session_idle_minutes: 60 },
        scenario_id: 'churn-associated',
        identity_status: 'RESOLVED'
      }
    ],
    analyze: (events) => ({
      scenarioId: 'churn-associated',
      name: 'Churn-Associated Journey',
      category: 'journey',
      eventsGenerated: events.length,
      detectedPattern: 'CHURN-ASSOCIATED PATTERN',
      identityStatus: 'RESOLVED',
      checklist: [
        { label: 'Payment Failure ($3,890.00 gateway error)', status: 'warning' },
        { label: 'Support Contact initiated by customer', status: 'checked' },
        { label: 'Repeat Contact due to unresolved billing query', status: 'warning' },
        { label: 'Case escalated to Tier-2 supervisor', status: 'warning' },
        { label: 'No Purchase recorded: high-risk churn indicator', status: 'warning' }
      ],
      explanation: 'Composite trajectory analysis detected a Churn-associated pattern: Payment Failure → Support Contact → Repeat Contact → Escalation → No Purchase. Note: This pattern is correlated with churn risk but does not imply single-point causality.',
      identityGraphType: 'linear',
      graphNodes: [
        { id: 'pf', label: 'Payment Failed', type: 'conflict', subtitle: 'Gateway Timeout' },
        { id: 'sc1', label: 'Support Call 1', type: 'evidence', subtitle: 'Case Created' },
        { id: 'sc2', label: 'Support Call 2', type: 'conflict', subtitle: 'Unresolved' },
        { id: 'esc', label: 'Escalated', type: 'conflict', subtitle: 'Priority HIGH' },
        { id: 'np', label: 'No Purchase', type: 'ambiguous', subtitle: 'Session Abandoned' }
      ],
      graphEdges: [
        { from: 'pf', to: 'sc1' },
        { from: 'sc1', to: 'sc2' },
        { from: 'sc2', to: 'esc' },
        { from: 'esc', to: 'np', dashed: true }
      ]
    })
  }
};
