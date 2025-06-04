import { z } from 'zod';

export const ErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  details: z.any().optional(),
}).openapi('Error');

export const MessageSchema = z.object({
  message: z.string(),
}).openapi('Message');

export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1).openapi({
    example: 1,
  }),
  limit: z.number().int().min(1).max(100).default(20).openapi({
    example: 20,
  }),
});

export const PaginationResponseSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
}).openapi('PaginationResponse');