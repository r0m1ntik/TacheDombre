import { supabase } from '$lib/supabaseClient';

export async function POST({ request }) {
    const { name } = await request.json();

    const { data, error } = await supabase
        .from('categories')
        .insert([{ name }])
        .select();

    if (error) {
        return new Response(JSON.stringify({ error: 'Erreur lors de la création de la catégorie.' }), { status: 500 });
    }

    return new Response(JSON.stringify({ category: data[0] }), { status: 201 });
}

export async function DELETE({ request }) {
    const { id } = await request.json();

    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .select();

    if (error) {
        return new Response(JSON.stringify({ error: 'Erreur lors de la suppression de la catégorie.' }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'Catégorie supprimée avec succès.' }), { status: 200 });
}

export async function PUT({ request }) {
    const { id, name } = await request.json();

    const { data, error } = await supabase
        .from('categories')
        .update({ name })
        .eq('id', id)
        .select();

    if (error) {
        return new Response(JSON.stringify({ error: 'Erreur lors de la modification de la catégorie.' }), { status: 500 });
    }

    return new Response(JSON.stringify({ category: data[0] }), { status: 200 });
}
