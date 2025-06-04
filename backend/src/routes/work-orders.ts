import { OpenAPIHono } from '@hono/zod-openapi';
import { authMiddleware } from '../middleware/auth';
import { createClient } from '@supabase/supabase-js';

export function registerWorkOrderRoutes(app: OpenAPIHono) {
  // Apply auth middleware to all work order routes
  app.use('/work-orders/*', authMiddleware);

  // Get work orders - simple endpoint
  app.get('/work-orders', async (c) => {
    try {
      console.log('=== WORK ORDERS REQUEST ===');
      
      // Get the JWT token from the request
      const authHeader = c.req.header('Authorization');
      const token = authHeader?.substring(7); // Remove "Bearer "
      
      console.log('Using JWT token for Supabase client');
      
      // Create a user-specific Supabase client with the JWT token
      const userSupabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        }
      );
      
      // Query work orders with location data
      const { data, error } = await userSupabase
        .from('work_orders')
        .select(`
          *,
          location:locations(*)
        `)
        .order('created_at', { ascending: false });

      console.log('Work orders query result:', {
        dataLength: data?.length,
        error: error,
        firstRecord: data?.[0]
      });

      if (error) {
        console.error('Supabase error:', error);
        return c.json({
          error: 'Failed to fetch work orders',
          details: error.message
        }, 500);
      }

      console.log('Work orders fetched successfully:', data?.length || 0, 'records');
      
      const response = {
        data: data || [],
        count: data?.length || 0
      };
      
      return c.json(response);

    } catch (error) {
      console.error('Route error:', error);
      return c.json({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 500);
    }
  });
}