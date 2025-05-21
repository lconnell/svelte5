// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface ProcessEnv {
			PUBLIC_CLERK_PUBLISHABLE_KEY: string;
			CLERK_SECRET_KEY: string;
			PUBLIC_CLERK_SIGN_IN_URL: string;
			PUBLIC_CLERK_SIGN_UP_URL: string;
			PUBLIC_CLERK_AFTER_SIGN_IN_URL: string;
			PUBLIC_CLERK_AFTER_SIGN_UP_URL: string;
		}
	}
}

export {};
