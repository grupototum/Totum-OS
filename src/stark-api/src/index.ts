import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import tarefasRoutes from './routes/tarefas.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:4173'],
  credentials: true
}));
app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    version: '1.0.0'
  });
});

// API routes
app.use('/api/tarefas', tarefasRoutes);

// Root route
app.get('/', (_req, res) => {
  res.json({
    name: 'Stark API',
    version: '1.0.0',
    description: 'API para gerenciamento de tarefas e integrações Totum',
    endpoints: {
      tarefas: '/api/tarefas',
      health: '/health'
    }
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('🚀 Stark API rodando na porta ' + PORT);
  console.log('📍 Ambiente: ' + NODE_ENV);
  console.log('🔗 URL: http://localhost:' + PORT);
  console.log('');
  console.log('Endpoints disponíveis:');
  console.log('  GET    /health           - Health check');
  console.log('  GET    /api/tarefas      - Listar tarefas');
  console.log('  GET    /api/tarefas/:id  - Obter tarefa');
  console.log('  POST   /api/tarefas      - Criar tarefa');
  console.log('  PATCH  /api/tarefas/:id  - Atualizar tarefa');
  console.log('  DELETE /api/tarefas/:id  - Deletar tarefa');
  console.log('');
});

export default app;