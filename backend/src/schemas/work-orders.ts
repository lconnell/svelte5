import { z } from 'zod';

// Enums
export const WorkOrderStatusEnum = z.enum(['open', 'in_progress', 'completed', 'cancelled']);
export const WorkOrderPriorityEnum = z.enum(['low', 'medium', 'high', 'urgent']);
export const UserRoleEnum = z.enum(['admin', 'manager', 'technician', 'customer']);

// Base schemas
export const ProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().nullable(),
  role: UserRoleEnum,
  phone: z.string().nullable(),
  avatar_url: z.string().url().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
}).openapi('Profile');

export const WorkOrderSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  status: WorkOrderStatusEnum,
  priority: WorkOrderPriorityEnum,
  assigned_to: z.string().uuid().nullable(),
  created_by: z.string().uuid(),
  due_date: z.string().datetime().nullable(),
  completed_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  customer_name: z.string().nullable(),
  customer_email: z.string().email().nullable(),
  customer_phone: z.string().nullable(),
  location: z.string().nullable(),
  estimated_hours: z.number().nullable(),
  actual_hours: z.number().nullable(),
  cost_estimate: z.number().nullable(),
  final_cost: z.number().nullable(),
  notes: z.string().nullable(),
}).openapi('WorkOrder');

export const WorkOrderWithProfilesSchema = WorkOrderSchema.extend({
  assigned_to_profile: ProfileSchema.nullable(),
  created_by_profile: ProfileSchema,
}).openapi('WorkOrderWithProfiles');

export const WorkOrderAttachmentSchema = z.object({
  id: z.string().uuid(),
  work_order_id: z.string().uuid(),
  file_name: z.string(),
  file_url: z.string().url(),
  file_size: z.number(),
  mime_type: z.string(),
  uploaded_by: z.string().uuid(),
  created_at: z.string().datetime(),
}).openapi('WorkOrderAttachment');

export const WorkOrderCommentSchema = z.object({
  id: z.string().uuid(),
  work_order_id: z.string().uuid(),
  comment: z.string(),
  created_by: z.string().uuid(),
  created_at: z.string().datetime(),
  is_internal: z.boolean(),
  created_by_profile: ProfileSchema,
}).openapi('WorkOrderComment');

// Input schemas
export const CreateWorkOrderSchema = z.object({
  title: z.string().min(1).max(255).openapi({
    example: 'Fix HVAC system in office building',
  }),
  description: z.string().optional().openapi({
    example: 'The air conditioning unit is not cooling properly on the 3rd floor.',
  }),
  priority: WorkOrderPriorityEnum.default('medium').openapi({
    example: 'high',
  }),
  assigned_to: z.string().uuid().optional().openapi({
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
  due_date: z.string().datetime().optional().openapi({
    example: '2024-01-15T10:00:00Z',
  }),
  customer_name: z.string().optional().openapi({
    example: 'John Smith',
  }),
  customer_email: z.string().email().optional().openapi({
    example: 'john@company.com',
  }),
  customer_phone: z.string().optional().openapi({
    example: '+1-555-0123',
  }),
  location: z.string().optional().openapi({
    example: '123 Main St, Office Building, Floor 3',
  }),
  estimated_hours: z.number().positive().optional().openapi({
    example: 4.5,
  }),
  cost_estimate: z.number().positive().optional().openapi({
    example: 450.00,
  }),
  notes: z.string().optional().openapi({
    example: 'Customer prefers morning appointments',
  }),
}).openapi('CreateWorkOrder');

export const UpdateWorkOrderSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().nullable().optional(),
  status: WorkOrderStatusEnum.optional(),
  priority: WorkOrderPriorityEnum.optional(),
  assigned_to: z.string().uuid().nullable().optional(),
  due_date: z.string().datetime().nullable().optional(),
  completed_at: z.string().datetime().nullable().optional(),
  customer_name: z.string().nullable().optional(),
  customer_email: z.string().email().nullable().optional(),
  customer_phone: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  estimated_hours: z.number().positive().nullable().optional(),
  actual_hours: z.number().positive().nullable().optional(),
  cost_estimate: z.number().positive().nullable().optional(),
  final_cost: z.number().positive().nullable().optional(),
  notes: z.string().nullable().optional(),
}).openapi('UpdateWorkOrder');

export const CreateCommentSchema = z.object({
  comment: z.string().min(1).openapi({
    example: 'Work has been completed successfully.',
  }),
  is_internal: z.boolean().default(false).openapi({
    example: false,
  }),
}).openapi('CreateComment');

// Query schemas
export const WorkOrderQuerySchema = z.object({
  page: z.number().int().min(1).default(1).openapi({
    example: 1,
  }),
  limit: z.number().int().min(1).max(100).default(20).openapi({
    example: 20,
  }),
  status: WorkOrderStatusEnum.optional().openapi({
    example: 'open',
  }),
  priority: WorkOrderPriorityEnum.optional().openapi({
    example: 'high',
  }),
  assigned_to: z.string().uuid().optional().openapi({
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
  created_by: z.string().uuid().optional().openapi({
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
  search: z.string().optional().openapi({
    example: 'HVAC',
  }),
}).openapi('WorkOrderQuery');

// Response schemas
export const WorkOrderListSchema = z.object({
  data: z.array(WorkOrderWithProfilesSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
}).openapi('WorkOrderList');

export const WorkOrderCommentsListSchema = z.object({
  data: z.array(WorkOrderCommentSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
}).openapi('WorkOrderCommentsList');