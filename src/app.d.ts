// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface PageData {
		tasks: Array<{
			id: number;
			title: string;
			description: string;
			category_id: number;
			priority: 'Basse' | 'Moyenne' | 'Haute';
			status: 'À faire' | 'En cours' | 'Terminé';
			due_date: string;
		}>;
	}
}
