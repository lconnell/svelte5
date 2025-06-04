import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { authMiddleware } from '../middleware/auth';
import { ProfileSchema, UserRoleEnum } from '../schemas/work-orders';
import { ErrorSchema, MessageSchema, PaginationSchema } from '../schemas/common';

export function registerProfileRoutes(app: OpenAPIHono) {
  // All profile routes require authentication
  app.use('/profiles/*', authMiddleware);

  // Get current user profile
  const getMeRoute = createRoute({
    method: 'get',
    path: '/profiles/me',
    tags: ['Profiles'],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        content: {
          'application/json': {
            schema: ProfileSchema,
          },
        },
        description: 'Current user profile',
      },
      401: {
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
        description: 'Unauthorized',
      },
      404: {
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
        description: 'Profile not found',
      },
    },
  });

  app.openapi(getMeRoute, async (c) => {
    const userId = c.get('userId');

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      return c.json({
        message: 'Profile not found',
        code: 'NOT_FOUND',
      }, 404);
    }

    return c.json(profile);
  });

  // Update current user profile
  const updateMeRoute = createRoute({
    method: 'patch',
    path: '/profiles/me',
    tags: ['Profiles'],
    security: [{ BearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              full_name: z.string().optional(),
              phone: z.string().optional(),
              avatar_url: z.string().url().optional(),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: ProfileSchema,
          },
        },
        description: 'Profile updated',
      },
      400: {
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
        description: 'Bad request',
      },
      401: {
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
        description: 'Unauthorized',
      },
    },
  });

  app.openapi(updateMeRoute, async (c) => {
    const userId = c.get('userId');
    const updates = c.req.valid('json');

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select('*')
      .single();

    if (error) {
      return c.json({
        message: 'Failed to update profile',
        code: 'UPDATE_ERROR',
        details: error.message,
      }, 400);
    }

    return c.json(profile);
  });

  // Get all profiles (for assigning work orders)
  const getProfilesRoute = createRoute({
    method: 'get',
    path: '/profiles',
    tags: ['Profiles'],
    security: [{ BearerAuth: [] }],
    request: {
      query: PaginationSchema.extend({
        role: UserRoleEnum.optional(),
        search: z.string().optional(),
      }),
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.object({
              data: z.array(ProfileSchema),
              pagination: z.object({
                page: z.number(),
                limit: z.number(),
                total: z.number(),
                totalPages: z.number(),
              }),
            }),
          },
        },
        description: 'List of profiles',
      },
      401: {
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
        description: 'Unauthorized',
      },
    },
  });

  app.openapi(getProfilesRoute, async (c) => {
    const query = c.req.valid('query');

    let supabaseQuery = supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('full_name', { ascending: true });

    // Apply filters
    if (query.role) {
      supabaseQuery = supabaseQuery.eq('role', query.role);
    }
    if (query.search) {
      supabaseQuery = supabaseQuery.or(`full_name.ilike.%${query.search}%,email.ilike.%${query.search}%`);
    }

    // Pagination
    const offset = (query.page - 1) * query.limit;
    supabaseQuery = supabaseQuery.range(offset, offset + query.limit - 1);

    const { data, error, count } = await supabaseQuery;

    if (error) {
      return c.json({
        message: 'Failed to fetch profiles',
        code: 'FETCH_ERROR',
        details: error.message,
      }, 500);
    }

    const totalPages = Math.ceil((count || 0) / query.limit);

    return c.json({
      data: data || [],
      pagination: {
        page: query.page,
        limit: query.limit,
        total: count || 0,
        totalPages,
      },
    });
  });

  // Get single profile
  const getProfileRoute = createRoute({
    method: 'get',
    path: '/profiles/{id}',
    tags: ['Profiles'],
    security: [{ BearerAuth: [] }],
    request: {
      params: z.object({
        id: z.string().uuid(),
      }),
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: ProfileSchema,
          },
        },
        description: 'Profile details',
      },
      404: {
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
        description: 'Profile not found',
      },
      401: {
        content: {
          'application/json': {
            schema: ErrorSchema,
          },
        },
        description: 'Unauthorized',
      },
    },
  });

  app.openapi(getProfileRoute, async (c) => {
    const { id } = c.req.valid('param');

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !profile) {
      return c.json({
        message: 'Profile not found',
        code: 'NOT_FOUND',
      }, 404);
    }

    return c.json(profile);
  });
}