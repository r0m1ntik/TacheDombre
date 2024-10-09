import { writable } from 'svelte/store';
import { supabase } from '$lib/auth';

// Store utilisateur
export const user = writable(null);

// Charger l'utilisateur à partir de la session actuelle
export const loadUser = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        console.error('Erreur lors de la récupération de la session', error.message);
        return;
    }

    // Si l'utilisateur est connecté, on met à jour le store
    if (data.session) {
        user.set(data.session.user);
    } else {
        user.set(null);
    }
};

// Fonction pour déconnecter l'utilisateur
export const signOutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Erreur lors de la déconnexion', error.message);
    } else {
        // On vide le store utilisateur après déconnexion
        user.set(null); 
    }
};