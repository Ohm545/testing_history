import http from 'http';

const BASE_URL = 'http://localhost:3000';

function request(method: string, path: string, body?: any): Promise<{ status: number; data: any }> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const postData = body ? JSON.stringify(body) : undefined;
    const req = http.request(
      url,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {})
        }
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(raw);
          } catch {
            parsed = raw;
          }
          resolve({ status: res.statusCode || 0, data: parsed });
        });
      }
    );
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING COMPREHENSIVE SIMULATOR API VERIFICATION ---');

  // 1. Health check
  const health = await request('GET', '/health');
  console.log('[1/8] GET /health:', health.status, health.data);
  if (health.status !== 200 || health.data.status !== 'ok') {
    throw new Error('Health check failed');
  }

  // 2. Reset before starting
  const reset1 = await request('POST', '/reset');
  console.log('[2/8] POST /reset:', reset1.status, reset1.data);

  // 3. Test POST /events (single event)
  const single = await request('POST', '/events', {
    event: {
      channel: 'web',
      event_type: 'page_view',
      session_id: 'SES-TEST-001',
      anonymous_id: 'ANON-TEST-001'
    }
  });
  console.log('[3/8] POST /events (single):', single.status, single.data);
  if (single.status !== 201 || !single.data.success || single.data.received !== 1) {
    throw new Error('Single event ingestion failed');
  }
  const singleEvtId = single.data.event_ids[0];

  // 4. Test GET /events/:eventId
  const evtById = await request('GET', `/events/${singleEvtId}`);
  console.log('[4/8] GET /events/:id:', evtById.status, evtById.data?.event?.event_id);
  if (evtById.status !== 200 || evtById.data.event.event_id !== singleEvtId) {
    throw new Error('Get event by id failed');
  }

  // 4b. Test GET /events/:invalidId
  const invalidEvt = await request('GET', '/events/EVT-NONEXISTENT');
  console.log('[4b/8] GET /events/EVT-NONEXISTENT (expect 404):', invalidEvt.status, invalidEvt.data);
  if (invalidEvt.status !== 404) {
    throw new Error('Expected 404 for invalid event id');
  }

  // 5. Test POST /events (batch)
  const batch = await request('POST', '/events', {
    events: [
      { channel: 'mobile_app', event_type: 'app_open', session_id: 'SES-TEST-002', device_id: 'DEV-TEST-02' },
      { channel: 'call_center', event_type: 'support_call', phone: '9876599999', customer_id: 'CUST-TEST-02' }
    ]
  });
  console.log('[5/8] POST /events (batch):', batch.status, batch.data.received, batch.data.event_ids);
  if (batch.status !== 201 || batch.data.received !== 2) {
    throw new Error('Batch event ingestion failed');
  }

  // 6. Test all 15 scenarios
  const scenarioIds = [
    'identity-resolution',
    'anonymous-login',
    'identity-ambiguity',
    'identity-conflict',
    'checkout-dropoff',
    'payment-failure',
    'call-center-escalation',
    'repeat-contact',
    'shared-browser',
    'multiple-phone',
    'physical-store',
    'mobile-app',
    'unresolved',
    'retrospective-resolution',
    'churn-associated'
  ];

  console.log(`[6/8] Executing all ${scenarioIds.length} required scenarios...`);
  for (const id of scenarioIds) {
    const scRes = await request('POST', `/demo/scenario/${id}`);
    if (scRes.status !== 200 || !scRes.data.success) {
      throw new Error(`Scenario '${id}' failed: ${JSON.stringify(scRes.data)}`);
    }
    console.log(`  ✓ Scenario '${id}': ${scRes.data.events_generated} events, Pattern: ${scRes.data.analysis?.detectedPattern}, Status: ${scRes.data.analysis?.identityStatus}`);
  }

  // 7. Check GET /events and filters
  const allEvents = await request('GET', '/events');
  console.log(`[7/8] GET /events: Total currently stored = ${allEvents.data.count}`);
  if (allEvents.data.count < 60) {
    throw new Error(`Expected >60 stored events, got ${allEvents.data.count}`);
  }

  const webEvents = await request('GET', '/events?channel=web');
  console.log(`  ✓ GET /events?channel=web: ${webEvents.data.count} events`);

  const purchaseEvents = await request('GET', '/events?event_type=purchase');
  console.log(`  ✓ GET /events?event_type=purchase: ${purchaseEvents.data.count} events`);

  const metrics = await request('GET', '/events/metrics/summary');
  console.log('  ✓ GET /events/metrics/summary:', metrics.data.metrics);

  // 8. Test POST /reset
  const reset2 = await request('POST', '/reset');
  console.log('[8/8] POST /reset:', reset2.status, reset2.data);
  const afterReset = await request('GET', '/events');
  console.log(`  ✓ After reset: ${afterReset.data.count} events in store`);
  if (afterReset.data.count !== 0) {
    throw new Error('Reset failed to clear event store');
  }

  console.log('\n=========================================');
  console.log(' ALL 8 ACCEPTANCE VERIFICATION PHASES PASSED!');
  console.log('=========================================\n');
}

// Start backend server in process and run tests
import { app, server } from './src/backend/server';

setTimeout(async () => {
  try {
    await runTests();
    server.close();
    process.exit(0);
  } catch (err) {
    console.error('Test error:', err);
    server.close();
    process.exit(1);
  }
}, 1000);
