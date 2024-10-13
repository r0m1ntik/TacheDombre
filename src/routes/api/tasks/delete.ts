import { supabase } from '$lib/supabaseClient';

export async function DELETE({ request }) {
    const { id } = await request.json();

    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

    if (error) {
        return { status: 500, body: { error: 'Erreur lors de la suppression de la tâche.' } };
    }

    return { status: 200, body: { message: 'Tâche supprimée avec succès.' } };
}