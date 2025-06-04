import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { registerWorkOrderRoutes } from './routes/work-orders';
import { registerProfileRoutes } from './routes/profiles';

const app = new OpenAPIHono();

// Middleware
app.use('/*', cors({
  origin: ['http://localhost:5173', 'http://localhost:4173'],
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.use(logger());

// Health check endpoint (no auth required)
app.get('/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Basic auth endpoint for testing
app.post('/api/v1/auth/login', async (c) => {
  const body = await c.req.json();
  
  // This is a mock endpoint - in real implementation, this would validate with Supabase
  return c.json({
    access_token: 'mock-token-for-testing',
    token_type: 'bearer',
    expires_in: 3600,
    user: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: body.email,
      role: 'admin'
    }
  });
});

// API routes
const api = app.basePath('/api/v1');
registerWorkOrderRoutes(api);
registerProfileRoutes(api);

// OpenAPI documentation
app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Work Order Management API',
    description: 'A comprehensive API for managing work orders, assignments, and customer interactions',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    }
  ]
});

// Swagger UI
app.get('/docs', swaggerUI({ url: '/openapi.json' }));

// Root endpoint
app.get('/', (c) => {
  return c.json({
    message: 'Work Order Management API',
    version: '1.0.0',
    docs: '/docs',
    openapi: '/openapi.json',
    health: '/health'
  });
});

export default {
  port: 3000,
  fetch: app.fetch,
};