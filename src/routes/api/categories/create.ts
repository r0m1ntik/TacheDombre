import { supabase } from '$lib/supabaseClient';

export async function POST({ request }) {
    const { name } = await request.json();

    const { data, error } = await supabase
        .from('categories')
        .insert([{ name }]);

    if (error) {
        return { status: 500, body: { error: 'Erreur lors de la création de la catégorie.' } };
    }

    return { status: 201, body: { category: data[0] } };
}