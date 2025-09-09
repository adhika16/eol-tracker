// @ts-nocheck
// src/routes/signup/+page.server.js

import { SESSION_COOKIE, createAdminClient } from "$lib/server/appwrite.js";
import { fail, error, redirect } from "@sveltejs/kit";
import { ID } from "node-appwrite";
import { PUBLIC_APPWRITE_TEST_MODE } from '$env/static/public';

export const load = () => {
  if (PUBLIC_APPWRITE_TEST_MODE === 'true') {
    throw error(404, { message: 'Page not available' });
  }
};

export const actions = {
	signup: async ({ request, cookies }) => {
		const form = await request.formData();
		const email = form.get('email');
		const password = form.get('password');
		const name = form.get('name');

		if (!email || !password || !name) {
			return fail(400, { error: 'Name, email and password are required' });
		}

		const { account } = createAdminClient();

		try {
			await account.create(ID.unique(), email, password, name);
			const session = await account.createEmailPasswordSession(email, password);

			cookies.set(SESSION_COOKIE, session.secret, {
				sameSite: 'strict',
				expires: new Date(session.expire),
				secure: true,
				path: '/'
			});
		} catch (error) {
			return fail(400, { error: error.message });
		}

		throw redirect(302, '/');
	}
};
