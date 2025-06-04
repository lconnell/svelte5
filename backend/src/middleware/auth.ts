import { Context } from 'hono';
import { getUserFromToken } from '../lib/supabase';

export async function authMiddleware(c: Context, next: () => Promise<void>) {
  const authHeader = c.req.header('Authorization');
  
  console.log('Auth middleware - Authorization header:', authHeader ? 'present' : 'missing');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Auth middleware - No valid auth header');
    return c.json({ message: 'Unauthorized', code: 'NO_TOKEN' }, 401);
  }

  const token = authHeader.substring(7);
  console.log('Auth middleware - Token length:', token.length);
  
  try {
    const user = await getUserFromToken(token);
    console.log('Auth middleware - User authenticated:', user.email);
    c.set('user', user);
    c.set('userId', user.id);
    await next();
  } catch (error) {
    console.log('Auth middleware - Authentication failed:', error instanceof Error ? error.message : 'Unknown error');
    return c.json({ 
      message: 'Invalid token', 
      code: 'INVALID_TOKEN',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 401);
  }
}