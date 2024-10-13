<script lang="ts">
    import Header from '../../components/Header.svelte';
    import Footer from '../../components/Footer.svelte';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { supabase } from '$lib/supabaseClient';
	import { currentUser, loadUser } from '$lib/stores/userStore'; 
    import { writable } from 'svelte/store';

    let tasks = [];
    let categories = [];
    let newTask = {
        title: '',
        description: '',
        category_id: null,
        priority: '',
        status: 'À faire',  // Valeur par défaut
        due_date: ''
    };
    let newCategoryName = '';
    let showCreateTaskModal = writable(false); // Pour afficher ou cacher le formulaire de création de tâche
    let showCreateCategoryModal = writable(false); // Pour afficher ou cacher le formulaire de création de catégorie

    // Récupérer les tâches et catégories de l'utilisateur connecté
    onMount(async () => {
        const user = await loadUser();
        if (!user) {
            goto('/');
        } else {
            // Récupérer les tâches
            const { data: tasksData, error: tasksError } = await supabase
                .from('tasks')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            if (!tasksError) tasks = tasksData || [];

            // Récupérer les catégories
            const { data: categoriesData, error: categoriesError } = await supabase
                .from('categories')
                .select('*')
                .order('name', { ascending: true });
            if (!categoriesError) categories = categoriesData || [];
        }
    });

    // Ajouter une nouvelle tâche
    const addTask = async () => {
        const userData = await loadUser();
        if (!userData) {
            console.error('Utilisateur non connecté');
            return;
        }

        const { data, error } = await supabase
            .from('tasks')
            .insert({
                title: newTask.title,
                description: newTask.description,
                category_id: newTask.category_id,
                priority: newTask.priority,
                status: newTask.status,
                due_date: newTask.due_date,
                user_id: userData.id
            })
            .select('*'); // Pour récupérer les données après l'insertion

        if (error) {
            console.error('Erreur lors de l’ajout de la tâche', error);
        } else if (data && data.length > 0) {
            // Ajouter la nouvelle tâche à la liste réactive des tâches
            tasks = [...tasks, data[0]];
            newTask = { title: '', description: '', category_id: null, priority: '', status: 'À faire', due_date: '' };
            // Fermer le modal après l'ajout
            showCreateTaskModal.set(false);
        } else {
            console.error('Aucune donnée retournée après l’ajout de la tâche');
        }
    };

    // Ajouter une nouvelle catégorie
    const addCategory = async () => {
        const { data, error } = await supabase
            .from('categories')
            .insert({ name: newCategoryName })
            .select()
            .order('name', { ascending: true });

        if (error) {
            console.error('Erreur lors de l’ajout de la catégorie', error);
        } else if (data && data.length > 0) {
            // Vérifier si 'data' est défini et contient au moins un élément
            categories = [...categories, data[0]];
            newCategoryName = '';
            showCreateCategoryModal.set(false);
        } else {
            console.error('Aucune donnée retournée après l’ajout de la catégorie');
        }
    };
</script>

<!-- Structure de la page Dashboard -->
<div class="flex flex-col min-h-screen">
    <!-- Header -->
    <Header {currentUser} />

    <!-- Contenu principal -->
    <main class="flex-grow p-8">
        <h1 class="text-3xl font-semibold mb-6">Tableau de bord</h1>

        <!-- Bouton pour créer une nouvelle tâche -->
        <button class="btn bg-blue-600 text-white mb-6" on:click={() => showCreateTaskModal.set(true)}>
            Créer une nouvelle tâche
        </button>

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
                            Statut : {task.status} | Créée le {new Date(task.created_at).toLocaleDateString()} | Date limite : {new Date(task.due_date).toLocaleDateString()}
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

    <!-- Modal pour créer une nouvelle tâche -->
    {#if $showCreateTaskModal}
        <div class="modal">
            <div class="modal-content border border-gray-200 dark:border-gray-600">
                <h2>Nouvelle tâche</h2>
                <input type="text" placeholder="Titre de la tâche" bind:value={newTask.title} class="input" />
                <textarea placeholder="Description" bind:value={newTask.description} class="input"></textarea>

                <!-- Sélection de la catégorie -->
                <select bind:value={newTask.category_id} class="input">
                    <option value="" disabled>Choisir une catégorie</option>
                    {#each categories as category}
                        <option value={category.id}>{category.name}</option>
                    {/each}
                </select>

                <!-- Option pour ajouter une nouvelle catégorie -->
                <button class="btn bg-gray-600 text-white mb-4" on:click={() => showCreateCategoryModal.set(true)}>Nouvelle catégorie</button>

                <!-- Sélection de la priorité -->
                <select bind:value={newTask.priority} class="input">
                    <option value="" disabled>Choisir une priorité</option>
                    <option value="Basse">Basse</option>
                    <option value="Moyenne">Moyenne</option>
                    <option value="Haute">Haute</option>
                </select>

                <!-- Sélection du statut -->
                <select bind:value={newTask.status} class="input">
                    <option value="À faire">À faire</option>
                    <option value="En cours">En cours</option>
                    <option value="Terminé">Terminé</option>
                </select>

                <!-- Date de fin -->
                <input type="date" bind:value={newTask.due_date} class="input" />

                <button class="btn bg-blue-600 text-white" on:click={addTask}>Ajouter la tâche</button>
                <button class="btn bg-gray-600 text-white" on:click={() => showCreateTaskModal.set(false)}>Annuler</button>
            </div>
        </div>
    {/if}

    <!-- Modal pour créer une nouvelle catégorie -->
    {#if $showCreateCategoryModal}
        <div class="modal">
            <div class="modal-content">
                <h2>Nouvelle catégorie</h2>
                <input type="text" placeholder="Nom de la catégorie" bind:value={newCategoryName} class="input" />
                <button class="btn bg-blue-600 text-white" on:click={addCategory}>Ajouter la catégorie</button>
                <button class="btn bg-gray-600 text-white" on:click={() => showCreateCategoryModal.set(false)}>Annuler</button>
            </div>
        </div>
    {/if}
</div>

<style>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal-content {
        background-color: rgb(17 24 38);
        padding: 2rem;
        border-radius: 10px;
        width: 100%;
        max-width: 400px;
    }

    .input {
        width: 100%;
        padding: 0.5rem;
        margin-bottom: 1rem;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    .btn {
        padding: 0.5rem 1rem;
        border-radius: 5px;
    }
</style>