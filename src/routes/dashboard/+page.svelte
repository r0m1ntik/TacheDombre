<script lang="ts">
    import Header from '../../components/Header.svelte';
    import Footer from '../../components/Footer.svelte';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { supabase } from '$lib/supabaseClient';
	import { currentUser, loadUser } from '$lib/stores/userStore'; 

    let tasks = [];

    onMount(async () => {
        const user = await loadUser();

        // Si l'utilisateur n'est pas connecté, rediriger vers la page principale
        if (!user) {
            goto('/');
        }

        // Si l'utilisateur est connecté, récupérer ses tâches
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', user.id);

        if (error) {
            console.error('Erreur lors de la récupération des tâches', error);
        } else {
            tasks = data || [];
        }
    });
</script>

<!-- Structure de la page Dashboard -->
<div class="flex flex-col min-h-screen">
    <!-- Header -->
    <Header {currentUser} />

    <!-- Contenu principal -->
    <main class="flex-grow p-8">
        <h1 class="text-3xl font-semibold mb-6">Tableau de bord</h1>

        <!-- Affichage des tâches de l'utilisateur -->
        {#if tasks.length > 0}
            <ul class="space-y-4">
                {#each tasks as task}
                    <li class="p-4 rounded-lg dark:bg-gray-900 border border-gray-200 dark:border-gray-600">
                        <div class="flex justify-between">
                            <h2 class="text-lg font-bold text-gray-700 dark:text-gray-300">{task.title}</h2>
                            <span class="badge">{task.priority}</span>
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
                        <p class="text-xs text-gray-400 dark:text-gray-500">
                            Créée le {new Date(task.created_at).toLocaleDateString()}
                        </p>
                    </li>
                {/each}
            </ul>
        {:else}
            <p class="text-gray-500 dark:text-gray-400">Aucune tâche disponible.</p>
        {/if}
    </main>

    <!-- Footer -->
    <Footer />
</div>