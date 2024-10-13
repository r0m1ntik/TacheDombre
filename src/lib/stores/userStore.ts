import { writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';
import { goto } from '$app/navigation';

export const currentUser = writable(null); // Stockage de l'utilisateur actuel

// Fonction pour charger l'utilisateur connecté
export async function loadUser() {
    try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
            currentUser.set(null);
            return null;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            currentUser.set(null);
            return null;
        }

        currentUser.set(user);
        return user;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur', error);
        currentUser.set(null);
        return null;
    }
}

// Fonction pour connecter l'utilisateur
export async function signIn(email: string, password: string) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            console.error('Erreur lors de la connexion', error);
            return { error };
        }

        currentUser.set(data.user);
        return { data };
    } catch (error) {
        console.error('Erreur lors de la connexion', error);
        return { error };
    }
}

// Fonction pour créer un compte utilisateur
export async function signUp(email: string, password: string) {
    try {
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            return { error };
        }

        return { data };
    } catch (error) {
        return { error };
    }
}

// Fonction pour déconnecter l'utilisateur
export const signOutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Erreur lors de la déconnexion');
    } else {
        currentUser.set(null);
        goto('/');
    }
};