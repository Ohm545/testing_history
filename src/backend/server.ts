import express from 'express';
import cors from 'cors';
import { eventsRouter } from './routes/events';
import { scenariosRouter } from './routes/scenarios';
import { systemRouter } from './routes/system';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for Vite frontend
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Request logger
app.use((req, _res, next) => {
  const start = Date.now();
  next();
  const duration = Date.now() - start;
  // Compact console log
  if (req.path !== '/health') {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path} - ${duration}ms`);
  }
});

// Mount Routes
app.use('/events', eventsRouter);
app.use('/demo/scenario', scenariosRouter);
app.use('/demo/scenarios', scenariosRouter);
app.use('/', systemRouter);

// Fallback 404
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found on JourneyFlow simulator backend'
  });
});

const server = app.listen(PORT, () => {
  console.log(`JourneyFlow Simulator Backend running at http://localhost:${PORT}`);
  console.log(`- Health: http://localhost:${PORT}/health`);
  console.log(`- Events: http://localhost:${PORT}/events`);
  console.log(`- Scenarios: http://localhost:${PORT}/demo/scenario/:id`);
});

export { app, server };
