import { SCENARIOS } from '../scenarios/definitions';
import { eventStore } from './eventStore';
import { ApiResponse, ScenarioMetadata } from '../../shared/types';

export class ScenarioRunner {
  public static run(scenarioId: string): ApiResponse {
    const def = SCENARIOS[scenarioId];
    if (!def) {
      throw new Error(`Scenario with id '${scenarioId}' was not found.`);
    }

    // 1. Generate realistic raw synthetic events for the scenario
    const rawEvents = def.generateEvents(new Date());

    // 2. CRITICAL: Process through the EXACT same event ingestion pipeline as POST /events
    const ingestedEvents = eventStore.ingestBatch(rawEvents);

    // 3. Analyze ingested events based on scenario rules
    const analysis = def.analyze(ingestedEvents);

    return {
      success: true,
      scenario: scenarioId,
      events_generated: ingestedEvents.length,
      events: ingestedEvents,
      metadata: def.metadata,
      analysis
    };
  }

  public static listScenarios(): ScenarioMetadata[] {
    return Object.values(SCENARIOS).map(s => s.metadata);
  }

  public static getScenarioMetadata(scenarioId: string): ScenarioMetadata | undefined {
    return SCENARIOS[scenarioId]?.metadata;
  }
}
