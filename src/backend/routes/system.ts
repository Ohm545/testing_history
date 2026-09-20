import { Router, Request, Response } from 'express';
import { eventStore } from '../services/eventStore';

export const systemRouter = Router();

// GET /health
systemRouter.get('/health', (_req: Request, res: Response) => {
  return res.json({
    status: 'ok',
    service: 'journeyflow-event-simulator'
  });
});

// POST /reset
systemRouter.post('/reset', (_req: Request, res: Response) => {
  try {
    eventStore.reset();
    return res.json({
      success: true,
      message: 'Demo reset successfully'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to reset demo'
    });
  }
});
