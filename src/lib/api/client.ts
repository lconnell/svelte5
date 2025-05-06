import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

const Body_login_login_access_token = z
	.object({
		grant_type: z.union([z.string(), z.null()]).optional(),
		username: z.string(),
		password: z.string(),
		scope: z.string().optional().default(''),
		client_id: z.union([z.string(), z.null()]).optional(),
		client_secret: z.union([z.string(), z.null()]).optional()
	})
	.passthrough();
const Token = z
	.object({ access_token: z.string(), token_type: z.string().optional().default('bearer') })
	.passthrough();
const ValidationError = z
	.object({ loc: z.array(z.union([z.string(), z.number()])), msg: z.string(), type: z.string() })
	.passthrough();
const HTTPValidationError = z
	.object({ detail: z.array(ValidationError) })
	.partial()
	.passthrough();
const UserPublic = z
	.object({
		email: z.string().max(255).email(),
		is_active: z.boolean().optional().default(true),
		is_superuser: z.boolean().optional().default(false),
		full_name: z.union([z.string(), z.null()]).optional(),
		id: z.string().uuid(),
		created_at: z.string().datetime({ offset: true })
	})
	.passthrough();
const Message = z.object({ message: z.string() }).passthrough();
const NewPassword = z
	.object({ token: z.string(), new_password: z.string().min(8).max(40) })
	.passthrough();
const UsersPublic = z.object({ data: z.array(UserPublic), count: z.number().int() }).passthrough();
const UserCreate = z
	.object({
		email: z.string().max(255).email(),
		is_active: z.boolean().optional().default(true),
		is_superuser: z.boolean().optional().default(false),
		full_name: z.union([z.string(), z.null()]).optional(),
		password: z.string().min(8).max(40)
	})
	.passthrough();
const UserUpdateMe = z
	.object({ full_name: z.union([z.string(), z.null()]), email: z.union([z.string(), z.null()]) })
	.partial()
	.passthrough();
const UpdatePassword = z
	.object({ current_password: z.string().min(8).max(40), new_password: z.string().min(8).max(40) })
	.passthrough();
const UserRegister = z
	.object({
		email: z.string().max(255).email(),
		password: z.string().min(8).max(40),
		full_name: z.union([z.string(), z.null()]).optional()
	})
	.passthrough();
const UserUpdate = z
	.object({
		email: z.union([z.string(), z.null()]),
		is_active: z.boolean().default(true),
		is_superuser: z.boolean().default(false),
		full_name: z.union([z.string(), z.null()]),
		password: z.union([z.string(), z.null()])
	})
	.partial()
	.passthrough();
export type ItemPublic = z.infer<typeof ItemPublic>;
const ItemPublic = z
	.object({
		title: z.string().min(1).max(255),
		description: z.union([z.string(), z.null()]).optional(),
		id: z.string().uuid(),
		owner_id: z.string().uuid(),
		created_at: z.string().datetime({ offset: true })
	})
	.passthrough();
const ItemsPublic = z.object({ data: z.array(ItemPublic), count: z.number().int() }).passthrough();
export type ItemCreate = z.infer<typeof ItemCreate>;
const ItemCreate = z
	.object({
		title: z.string().min(1).max(255),
		description: z.union([z.string(), z.null()]).optional()
	})
	.passthrough();
export type ItemUpdate = z.infer<typeof ItemUpdate>;
const ItemUpdate = z
	.object({ title: z.union([z.string(), z.null()]), description: z.union([z.string(), z.null()]) })
	.partial()
	.passthrough();
const PrivateUserCreate = z
	.object({
		email: z.string(),
		password: z.string(),
		full_name: z.string(),
		is_verified: z.boolean().optional().default(false)
	})
	.passthrough();

export type ItemsDeleteItemParams = { id: string };
export const schemas = {
	Body_login_login_access_token,
	Token,
	ValidationError,
	HTTPValidationError,
	UserPublic,
	Message,
	NewPassword,
	UsersPublic,
	UserCreate,
	UserUpdateMe,
	UpdatePassword,
	UserRegister,
	UserUpdate,
	ItemPublic,
	ItemsPublic,
	ItemCreate,
	ItemUpdate,
	PrivateUserCreate
};

const endpoints = makeApi([
	{
		method: 'get',
		path: '/api/v1/items/',
		alias: 'items-read_items',
		description: `Retrieve items.`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'skip',
				type: 'Query',
				schema: z.number().int().optional().default(0)
			},
			{
				name: 'limit',
				type: 'Query',
				schema: z.number().int().optional().default(100)
			}
		],
		response: ItemsPublic,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			}
		]
	},
	{
		method: 'post',
		path: '/api/v1/items/',
		alias: 'items-create_item',
		description: `Create new item.`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'body',
				type: 'Body',
				schema: ItemCreate
			}
		],
		response: ItemPublic,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			}
		]
	},
	{
		method: 'get',
		path: '/api/v1/items/:id',
		alias: 'items-read_item',
		description: `Get item by ID.`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'id',
				type: 'Path',
				schema: z.string().uuid()
			}
		],
		response: ItemPublic,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			}
		]
	},
	{
		method: 'put',
		path: '/api/v1/items/:id',
		alias: 'items-update_item',
		description: `Update an item.`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'body',
				type: 'Body',
				schema: ItemUpdate
			},
			{
				name: 'id',
				type: 'Path',
				schema: z.string().uuid()
			}
		],
		response: ItemPublic,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			}
		]
	},
	{
		method: 'delete',
		path: '/api/v1/items/:id',
		alias: 'items-delete_item',
		description: `Delete an item.`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'id',
				type: 'Path',
				schema: z.string().uuid()
			}
		],
		response: z.object({ message: z.string() }).passthrough(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			}
		]
	},
	{
		method: 'post',
		path: '/api/v1/login/access-token',
		alias: 'login-login_access_token',
		description: `OAuth2 compatible token login, get an access token for future requests`,
		requestFormat: 'form-url',
		parameters: [
			{
				name: 'body',
				type: 'Body',
				schema: Body_login_login_access_token
			}
		],
		response: Token,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			}
		]
	},
	{
		method: 'post',
		path: '/api/v1/login/test-token',
		alias: 'login-test_token',
		description: `Test access token`,
		requestFormat: 'json',
		response: UserPublic
	},
	{
		method: 'post',
		path: '/api/v1/password-recovery-html-content/:email',
		alias: 'login-recover_password_html_content',
		description: `HTML Content for Password Recovery`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'email',
				type: 'Path',
				schema: z.string()
			}
		],
		response: z.void(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			}
		]
	},
	{
		method: 'post',
		path: '/api/v1/password-recovery/:email',
		alias: 'login-recover_password',
		description: `Password Recovery`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'email',
				type: 'Path',
				schema: z.string()
			}
		],
		response: z.object({ message: z.string() }).passthrough(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			}
		]
	},
	{
		method: 'post',
		path: '/api/v1/private/users/',
		alias: 'private-create_user',
		description: `Create a new user.`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'body',
				type: 'Body',
				schema: PrivateUserCreate
			}
		],
		response: UserPublic,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			}
		]
	},
	{
		method: 'post',
		path: '/api/v1/reset-password/',
		alias: 'login-reset_password',
		description: `Reset password`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'body',
				type: 'Body',
				schema: NewPassword
			}
		],
		response: z.object({ message: z.string() }).passthrough(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			}
		]
	},
	{
		method: 'get',
		path: '/api/v1/users/',
		alias: 'users-read_users',
		description: `Retrieve users.`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'skip',
				type: 'Query',
				schema: z.number().int().optional().default(0)
			},
			{
				name: 'limit',
				type: 'Query',
				schema: z.number().int().optional().default(100)
			}
		],
		response: UsersPublic,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			}
		]
	},
	{
		method: 'post',
		path: '/api/v1/users/',
		alias: 'users-create_user',
		description: `Create new user.`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'body',
				type: 'Body',
				schema: UserCreate
			}
		],
		response: UserPublic,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			}
		]
	},
	{
		method: 'get',
		path: '/api/v1/users/:user_id',
		alias: 'users-read_user_by_id',
		description: `Get a specific user by id.`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'user_id',
				type: 'Path',
				schema: z.string().uuid()
			}
		],
		response: UserPublic,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			}
		]
	},
	{
		method: 'patch',
		path: '/api/v1/users/:user_id',
		alias: 'users-update_user',
		description: `Update a user.`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'body',
				type: 'Body',
				schema: UserUpdate
			},
			{
				name: 'user_id',
				type: 'Path',
				schema: z.string().uuid()
			}
		],
		response: UserPublic,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			}
		]
	},
	{
		method: 'delete',
		path: '/api/v1/users/:user_id',
		alias: 'users-delete_user',
		description: `Delete a user.`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'user_id',
				type: 'Path',
				schema: z.string().uuid()
			}
		],
		response: z.object({ message: z.string() }).passthrough(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			}
		]
	},
	{
		method: 'get',
		path: '/api/v1/users/me',
		alias: 'users-read_user_me',
		description: `Get current user.`,
		requestFormat: 'json',
		response: UserPublic
	},
	{
		method: 'delete',
		path: '/api/v1/users/me',
		alias: 'users-delete_user_me',
		description: `Delete own user.`,
		requestFormat: 'json',
		response: z.object({ message: z.string() }).passthrough()
	},
	{
		method: 'patch',
		path: '/api/v1/users/me',
		alias: 'users-update_user_me',
		description: `Update own user.`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'body',
				type: 'Body',
				schema: UserUpdateMe
			}
		],
		response: UserPublic,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			}
		]
	},
	{
		method: 'patch',
		path: '/api/v1/users/me/password',
		alias: 'users-update_password_me',
		description: `Update own password.`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'body',
				type: 'Body',
				schema: UpdatePassword
			}
		],
		response: z.object({ message: z.string() }).passthrough(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			}
		]
	},
	{
		method: 'post',
		path: '/api/v1/users/signup',
		alias: 'users-register_user',
		description: `Create new user without the need to be logged in.`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'body',
				type: 'Body',
				schema: UserRegister
			}
		],
		response: UserPublic,
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			}
		]
	},
	{
		method: 'get',
		path: '/api/v1/utils/health-check/',
		alias: 'utils-health_check',
		requestFormat: 'json',
		response: z.boolean()
	},
	{
		method: 'post',
		path: '/api/v1/utils/test-email/',
		alias: 'utils-test_email',
		description: `Test emails.`,
		requestFormat: 'json',
		parameters: [
			{
				name: 'email_to',
				type: 'Query',
				schema: z.string().email()
			}
		],
		response: z.object({ message: z.string() }).passthrough(),
		errors: [
			{
				status: 422,
				description: `Validation Error`,
				schema: HTTPValidationError
			}
		]
	}
]);

// ⚠️ Do NOT use a default 'api' instance from this file.
// Always use 'createApiClient' and import from client-wrapper.ts for correct path interpolation.
// This is a deliberate safeguard against accidental misuse.
// If you need an API instance, use:
// import { api } from './client-wrapper';
//
// export const api = new Zodios(endpoints); // <-- REMOVED

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
	return new Zodios(baseUrl, endpoints, options);
}
