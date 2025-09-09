import { redirect } from '@sveltejs/kit';
import { createSessionClient, SESSION_COOKIE } from '$lib/server/appwrite';

// Define our log out endpoint/server action.
export const actions = {
  default: async (event) => {
    // Create the Appwrite client.
    const { account } = createSessionClient(event);

    // Delete the session on Appwrite, and delete the session cookie.
    await account.deleteSession("current");
    event.cookies.delete(SESSION_COOKIE, { path: "/" });

    // Redirect to the login page.
    redirect(302, "/login");
  },
};

