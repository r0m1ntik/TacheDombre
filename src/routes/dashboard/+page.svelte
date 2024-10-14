<script lang="ts">
    import Header from '../../components/Header.svelte';
    import Footer from '../../components/Footer.svelte';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { writable } from 'svelte/store';
    import { currentUser, loadUser } from '$lib/stores/userStore';
	import { supabase } from '$lib/supabaseClient';

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
    let showCreateTaskModal = writable(false);
    let showCreateCategoryModal = writable(false);

    // Charger les tâches et les catégories de l'utilisateur connecté
    onMount(async () => {
        const user = await loadUser();
        if (!user) {
            goto('/');
        } else {
            const { data: tasksData, error: tasksError } = await supabase
                .from('tasks')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            if (!tasksError) tasks = tasksData || [];

            const { data: categoriesData, error: categoriesError } = await supabase
                .from('categories')
                .select('*')
                .order('name', { ascending: true });
            if (!categoriesError) categories = categoriesData || [];
        }
    });

    const addTask = async () => {
        const user = await loadUser();
        if (!user || !user.id) {
            console.error('Utilisateur non connecté ou ID utilisateur manquant');
            return;
        }

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newTask.title,
                    description: newTask.description,
                    category_id: newTask.category_id,
                    priority: newTask.priority,
                    status: newTask.status,
                    due_date: newTask.due_date,
                    user_id: user.id
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erreur lors de la création de la tâche', errorData.error);
                return;
            }

            const { task } = await response.json();
            tasks = [...tasks, task];
            newTask = { title: '', description: '', category_id: null, priority: '', status: 'À faire', due_date: '' };
            showCreateTaskModal.set(false);

        } catch (error) {
            console.error('Erreur lors de la requête:', error);
        }
    };

    
    // Fonction pour supprimer une tâche
    const deleteTask = async (taskId) => {
        const confirmation = confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?');
        if (!confirmation) return;

        const response = await fetch('/api/tasks', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: taskId })
        });

        if (response.ok) {
            tasks = tasks.filter(task => task.id !== taskId);
        } else {
            console.error('Erreur lors de la suppression de la tâche');
        }
    };

    // Fonction pour modifier une tâche
    const updateTask = async (taskId) => {
        const response = await fetch('/api/tasks', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: taskId,
                title: newTask.title,
                description: newTask.description,
                category_id: newTask.category_id,
                priority: newTask.priority,
                status: newTask.status,
                due_date: newTask.due_date
            })
        });

        if (response.ok) {
            const { task } = await response.json();
            tasks = tasks.map(t => (t.id === taskId ? task : t));
            newTask = { title: '', description: '', category_id: null, priority: '', status: 'À faire', due_date: '' };
            showCreateTaskModal.set(false);
        } else {
            console.error('Erreur lors de la modification de la tâche');
        }
    };

    // Fonction pour remplir le formulaire lors de la modification
    const editTask = (task) => {
        newTask = { ...task };
        showCreateTaskModal.set(true);
    };

    const addCategory = async () => {
        if (!newCategoryName.trim()) {
            console.error('Le nom de la catégorie ne peut pas être vide.');
            return;
        }

        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategoryName })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erreur lors de la création de la catégorie', errorData.error);
                return;
            }

            const { category } = await response.json();
            // Ajout de la nouvelle catégorie à la liste des catégories
            categories = [...categories, category]; 
            newCategoryName = '';
        } catch (error) {
            console.error('Erreur lors de la requête:', error);
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
                        <div class="flex justify-end space-x-2">
                            <!-- Bouton de modification -->
                            <button class="btn bg-yellow-500 text-white" on:click={() => editTask(task)}>
                                Modifier
                            </button>
                            <!-- Bouton de suppression -->
                            <button class="btn bg-red-500 text-white" on:click={() => deleteTask(task.id)}>
                                Supprimer
                            </button>
                        </div>
                    </li>
                {/each}
            </ul>
        {:else}
            <p class="text-gray-500 dark:text-gray-400">Aucune tâche disponible.</p>
        {/if}
    </main>

    <!-- Footer -->
    <Footer />

    <!-- Modal pour créer ou modifier une tâche -->
    {#if $showCreateTaskModal}
        <div class="modal">
            <div class="modal-content border border-gray-200 dark:border-gray-600">
                <h2>{newTask.id ? 'Modifier la tâche' : 'Nouvelle tâche'}</h2>
                <input type="text" placeholder="Titre de la tâche" bind:value={newTask.title} class="input" />
                <textarea placeholder="Description" bind:value={newTask.description} class="input"></textarea>

                <!-- Sélection de la catégorie -->
                <select bind:value={newTask.category_id} class="input">
                    <option value="" disabled>Choisir une catégorie</option>
                    {#each categories as category}
                        <option value={category.id}>{category.name}</option>
                    {/each}
                </select>

                <!-- Champ pour créer une nouvelle catégorie -->
                <input 
                    type="text" 
                    placeholder="Nouvelle catégorie" 
                    bind:value={newCategoryName} 
                    class="input"
                />
                <button class="btn bg-gray-600 text-white mb-4" on:click={addCategory}>
                    Ajouter une nouvelle catégorie
                </button>

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

                <button class="btn bg-blue-600 text-white" on:click={() => newTask.id ? updateTask(newTask.id) : addTask()}>
                    {newTask.id ? 'Modifier la tâche' : 'Ajouter la tâche'}
                </button>
                <button class="btn bg-gray-600 text-white" on:click={() => showCreateTaskModal.set(false)}>Annuler</button>
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