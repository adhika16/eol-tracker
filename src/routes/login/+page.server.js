// src/routes/login/+page.server.js
// @ts-nocheck
import { SESSION_COOKIE, createAdminClient } from "$lib/server/appwrite.js";
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    login: async ({ cookies, request }) => {
        const data = await request.formData();
        const email = data.get('email');
        const password = data.get('password');

        if (!email || !password) {
            return fail(400, { error: 'Email and password are required' });
        }

        const { account } = createAdminClient();
        let session;

        try {
            session = await account.createEmailPasswordSession(email, password);
        } catch (error) {
            return fail(401, { error: error.message });
        }

        cookies.set(SESSION_COOKIE, session.secret, {
            sameSite: "strict",
            expires: new Date(session.expire),
            secure: true,
            path: "/",
        });
        
        throw redirect(302, '/account');
    }
};
