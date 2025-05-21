export const prerender = true;

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (event) => {
  const { user, session } = event.locals; // Get user and session from Clerk

  return {
    user,
    session,
  };
};
