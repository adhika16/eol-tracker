import { fail } from '@sveltejs/kit';
import { createSessionClient, DB_ID, USER_FRAMEWORKS_COL_ID } from '$lib/server/appwrite';
import { Query } from 'node-appwrite';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const { url, locals } = event;
	const framework = url.searchParams.get('framework');
	let cycles = null;

	if (framework) {
		try {
			const response = await fetch(`https://endoflife.date/api/${framework}.json`);
			if (!response.ok) {
				return fail(response.status, { error: 'Failed to fetch EOL data.' });
			}
			cycles = await response.json();
		} catch (err) {
			return fail(500, { error: 'An error occurred while fetching EOL data.' });
		}
	}

	if (locals.user) {
		const { databases } = createSessionClient(event);
		const userFrameworks = await databases.listDocuments(DB_ID, USER_FRAMEWORKS_COL_ID, [
			Query.equal('user_id', locals.user.$id)
		]);

		const trackedFrameworks = await Promise.all(
			userFrameworks.documents.map(async (doc) => {
				const response = await fetch(`https://endoflife.date/api/${doc.framework_slug}.json`);
				const eolData = await response.json();

				// @ts-ignore
				const userCycle = eolData.find((cycle) => doc.version.startsWith(cycle.cycle));

				let status = 'Unknown';
				if (userCycle) {
					status = new Date(userCycle.eol) < new Date() ? 'End of Life' : 'Supported';
				}

				return {
					...doc,
					status,
					eol: userCycle?.eol
				};
			})
		);

		return {
			cycles,
			user: locals.user,
			trackedFrameworks
		};
	}

	return { cycles };
}

/** @type {import('./$types').Actions} */
export const actions = {
	addFramework: async (event) => {
		const { request, locals } = event;
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const framework = formData.get('framework');
		const version = formData.get('version');

		if (!framework || typeof framework !== 'string' || !version || typeof version !== 'string') {
			return fail(400, { error: 'Framework and version are required' });
		}

		try {
			const { databases } = createSessionClient(event);
			await databases.createDocument(DB_ID, USER_FRAMEWORKS_COL_ID, 'unique()', {
				user_id: locals.user.$id,
				framework_slug: framework,
				version: version
			});
			return { success: true };
		} catch (error) {
			return fail(500, { error: 'Failed to add framework.' });
		}
	},
	removeFramework: async (event) => {
		const { request, locals } = event;
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const docId = formData.get('docId');

		if (!docId || typeof docId !== 'string') {
			return fail(400, { error: 'Invalid document ID' });
		}

		try {
			const { databases } = createSessionClient(event);
			await databases.deleteDocument(DB_ID, USER_FRAMEWORKS_COL_ID, docId);
			return { success: true };
		} catch (error) {
			return fail(500, { error: 'Failed to remove framework.' });
		}
	}
};
