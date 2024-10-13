import { supabase } from '$lib/supabaseClient';

export async function PUT({ request }) {
    const { id, title, description, category_id, priority, status, due_date } = await request.json();

    const { data, error } = await supabase
        .from('tasks')
        .update({ title, description, category_id, priority, status, due_date })
        .eq('id', id);

    if (error) {
        return { status: 500, body: { error: 'Erreur lors de la modification de la tâche.' } };
    }

    return { status: 200, body: { task: data[0] } };
}