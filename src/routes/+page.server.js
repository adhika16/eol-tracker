import { fail } from '@sveltejs/kit';
import { createSessionClient, DB_ID, USER_FRAMEWORKS_COL_ID } from '$lib/server/appwrite';
import { Query } from 'node-appwrite';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const { url, locals } = event;
	const framework = url.searchParams.get('framework');
	let cycles = [];
	let error = null;

	if (framework) {
		try {
			const response = await fetch(`https://endoflife.date/api/v1/products/${framework}`);
			if (!response.ok) {
				if (response.status === 404) {
					 error = `No EOL data found for "${framework}". Check the framework name.`;
				}
				error = 'Failed to fetch EOL data.';
			} else {
				const data = await response.json();
				cycles = data.result.releases;
				if (!cycles || cycles.length === 0) {
					error = `No EOL data found for "${framework}".`;
				}
			}
		} catch (err) {
			error = 'An error occurred while fetching EOL data.';
		}
	}

	if (locals.user) {
		const { databases } = createSessionClient(event);
		const userFrameworks = await databases.listDocuments(DB_ID, USER_FRAMEWORKS_COL_ID, [
			Query.equal('user_id', locals.user.$id)
		]);

		const trackedFrameworks = await Promise.all(
			userFrameworks.documents.map(async (doc) => {
				try {
					const response = await fetch(`https://endoflife.date/api/v1/products/${doc.framework_slug}`);
					if (!response.ok) {
						return {
							...doc,
							status: 'Error',
							eol: null,
							error: 'Failed to fetch EOL data'
						};
					}
					const eolData = await response.json();
					const releases = eolData.result.releases;
					if (!Array.isArray(releases) || releases.length === 0) {
						return {
							...doc,
							status: 'Unknown',
							eol: null,
							error: 'No EOL data found'
						};
					}
					const userCycle = releases.find((cycle) => doc.version.startsWith(cycle.name));
					let status = 'Unknown';
					let eol = null;
					if (userCycle) {
						status = userCycle.isEol ? 'End of Life' : 'Supported';
						eol = userCycle.eolFrom;
					}
					return {
						...doc,
						status,
						eol
					};
				} catch (err) {
					return {
						...doc,
						status: 'Error',
						eol: null,
						error: 'Error fetching EOL data'
					};
				}
			})
		);

		return {
			cycles,
			user: locals.user,
			trackedFrameworks,
			error
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
