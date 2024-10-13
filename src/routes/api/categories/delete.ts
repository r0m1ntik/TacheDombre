import { supabase } from '$lib/supabaseClient';

export async function DELETE({ request }) {
    const { id } = await request.json();

    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

    if (error) {
        return { status: 500, body: { error: 'Erreur lors de la suppression de la catégorie.' } };
    }

    return { status: 200, body: { message: 'Catégorie supprimée avec succès.' } };
}