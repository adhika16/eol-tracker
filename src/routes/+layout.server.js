import { SESSION_COOKIE } from '$lib/server/appwrite';

export async function load({ locals, cookies }) {
	const sessionId = cookies.get(SESSION_COOKIE);

	if (!sessionId) {
		return {
			user: null
		};
	}

  // Logged out users can't access this page.
  if (!locals.user) {
    return {
      user: null
    };
  }

  // Pass the stored user local to the page.
  return {
    user: locals.user,
  };
}
