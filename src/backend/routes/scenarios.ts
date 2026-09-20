import { Router, Request, Response } from 'express';
import { ScenarioRunner } from '../services/scenarioRunner';

export const scenariosRouter = Router();

// GET /demo/scenarios - List all scenarios with metadata
scenariosRouter.get('/', (_req: Request, res: Response) => {
  try {
    const list = ScenarioRunner.listScenarios();
    return res.json({
      success: true,
      count: list.length,
      scenarios: list
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message });
  }
});

// POST /demo/scenario/:scenarioId - Run a predefined scenario
scenariosRouter.post('/:scenarioId', (req: Request, res: Response) => {
  const { scenarioId } = req.params;
  try {
    const result = ScenarioRunner.run(scenarioId);
    return res.status(200).json(result);
  } catch (error: any) {
    const isNotFound = error.message?.includes('not found');
    return res.status(isNotFound ? 404 : 500).json({
      success: false,
      message: error?.message || `Failed to run scenario '${scenarioId}'`
    });
  }
});
