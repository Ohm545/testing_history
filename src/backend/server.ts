import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { eventsRouter } from './routes/events';
import { scenariosRouter } from './routes/scenarios';
import { systemRouter } from './routes/system';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend and external callers
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
  if (req.path !== '/health' && req.path !== '/api/health') {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path} - ${duration}ms`);
  }
});

// Mount Routes (supports both direct and /api/ prefixed calls for Vercel)
app.use('/events', eventsRouter);
app.use('/api/events', eventsRouter);

app.use('/demo/scenario', scenariosRouter);
app.use('/demo/scenarios', scenariosRouter);
app.use('/api/demo/scenario', scenariosRouter);
app.use('/api/demo/scenarios', scenariosRouter);

app.use('/', systemRouter);
app.use('/api', systemRouter);

// Serve React frontend (built by vite) in production
const distPath = path.resolve(__dirname, '../../../dist');
app.use(express.static(distPath));

// SPA fallback — all unmatched routes serve index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

let server: any = null;
if (!process.env.VERCEL) {
  server = app.listen(PORT, () => {
    console.log(`JourneyFlow Simulator Backend running at http://localhost:${PORT}`);
    console.log(`- Health: http://localhost:${PORT}/health`);
    console.log(`- Events: http://localhost:${PORT}/events`);
    console.log(`- Scenarios: http://localhost:${PORT}/demo/scenario/:id`);
  });
}

export { app, server };
export default app;
