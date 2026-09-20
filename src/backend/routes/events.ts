import { Router, Request, Response } from 'express';
import { eventStore } from '../services/eventStore';
import { IngestEventsPayload, SimulatorEvent } from '../../shared/types';

export const eventsRouter = Router();

// POST /events
eventsRouter.post('/', (req: Request, res: Response) => {
  try {
    const body = req.body as IngestEventsPayload;
    let ingested: SimulatorEvent[] = [];

    if (body && Array.isArray(body.events)) {
      if (body.events.length === 0) {
        return res.status(400).json({ success: false, message: 'events array cannot be empty' });
      }
      ingested = eventStore.ingestBatch(body.events);
    } else if (body && body.event && typeof body.event === 'object') {
      const single = eventStore.ingestEvent(body.event);
      ingested = [single];
    } else if (req.body && typeof req.body === 'object' && !body.event && !body.events && Object.keys(req.body).length > 0) {
      // Direct raw event object passed at root
      const single = eventStore.ingestEvent(req.body);
      ingested = [single];
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid request payload. Expected { event: {...} } or { events: [...] }'
      });
    }

    return res.status(201).json({
      success: true,
      received: ingested.length,
      event_ids: ingested.map(e => e.event_id),
      events: ingested
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to ingest event(s)'
    });
  }
});

// GET /events/metrics/summary
eventsRouter.get('/metrics/summary', (_req: Request, res: Response) => {
  try {
    const metrics = eventStore.getMetrics();
    return res.json({ success: true, metrics });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message });
  }
});

// GET /events
eventsRouter.get('/', (req: Request, res: Response) => {
  try {
    const { channel, event_type, scenario, search } = req.query;
    const events = eventStore.getAllEvents({
      channel: typeof channel === 'string' ? channel : undefined,
      event_type: typeof event_type === 'string' ? event_type : undefined,
      scenario: typeof scenario === 'string' ? scenario : undefined,
      search: typeof search === 'string' ? search : undefined,
    });

    return res.json({
      success: true,
      count: events.length,
      events
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message });
  }
});

// GET /events/:eventId
eventsRouter.get('/:eventId', (req: Request, res: Response) => {
  const { eventId } = req.params;
  const event = eventStore.getEventById(eventId);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found'
    });
  }

  return res.json({
    success: true,
    event
  });
});
