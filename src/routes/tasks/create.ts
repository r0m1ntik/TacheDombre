// src/routes/api/tasks/create.ts
import { supabase } from '$lib/supabaseClient';

export async function POST({ request }) {
    const { title, description, category_id, priority, status, due_date, user_id } = await request.json();
    const { data, error } = await supabase
        .from('tasks')
        .insert([{ title, description, category_id, priority, status, due_date, user_id }]);
    if (error) {
        return { status: 500, body: { error: 'Erreur lors de la création de la tâche.' } };
    }
    return { status: 201, body: { task: data[0] } };
}