import { supabase } from '$lib/supabaseClient';

export async function POST({ request }) {
    const { title, description, category_id, priority, status, due_date, user_id } = await request.json();
    
    // Insertion dans la base de données
    const { data, error } = await supabase
        .from('tasks')
        .insert([{ title, description, category_id, priority, status, due_date, user_id }])
        .select(); // Assure de récupérer les données insérées
    
    // Vérifier s'il y a une erreur
    if (error) {
        return new Response(
            JSON.stringify({ error: 'Erreur lors de la création de la tâche.' }), 
            { status: 500 }
        );
    }

    // Retourner les données de la tâche créée
    return new Response(
        JSON.stringify({ task: data[0] }), 
        { status: 201 }
    );
}

export async function DELETE({ request }) {
    const { id } = await request.json();
    
    // Suppression dans la base de données
    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .select();
    
    if (error) {
        return new Response(
            JSON.stringify({ error: 'Erreur lors de la suppression de la tâche.' }), 
            { status: 500 }
        );
    }

    return new Response(
        JSON.stringify({ message: 'Tâche supprimée avec succès.' }), 
        { status: 200 }
    );
}

export async function PUT({ request }) {
    const { id, title, description, category_id, priority, status, due_date } = await request.json();

    // Mise à jour dans la base de données
    const { data, error } = await supabase
        .from('tasks')
        .update({ title, description, category_id, priority, status, due_date })
        .eq('id', id)
        .select();

    if (error) {
        return new Response(
            JSON.stringify({ error: 'Erreur lors de la modification de la tâche.' }), 
            { status: 500 }
        );
    }

    return new Response(
        JSON.stringify({ task: data[0] }), 
        { status: 200 }
    );
}