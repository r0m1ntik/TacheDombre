import { supabase } from '$lib/supabaseClient';

export async function PUT({ request }) {
    const { id, name } = await request.json();

    const { data, error } = await supabase
        .from('categories')
        .update({ name })
        .eq('id', id);

    if (error) {
        return { status: 500, body: { error: 'Erreur lors de la modification de la catégorie.' } };
    }

    return { status: 200, body: { category: data[0] } };
}