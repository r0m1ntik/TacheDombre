<script lang="ts">
    import Signup from './Signup.svelte';
    import Login from './Login.svelte';
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
    import { Accordion, AccordionItem, InputChip, Autocomplete, AppBar } from '@skeletonlabs/skeleton';
    import type { AutocompleteOption } from '@skeletonlabs/skeleton';

    export let showModal: boolean;
    export let showSignUp: boolean;
    export let closeModal: () => void;
    export let handleKeyDown: (e: KeyboardEvent) => void;

    let tasks = [];
    let categories = [];
    let inputChip = ''; // Valeur pour l'InputChip
    let selectedCategories: string[] = []; // Liste des catégories sélectionnées
    let categoryOptions: AutocompleteOption<string>[] = [];

    // Récupérer toutes les tâches et les catégories depuis Supabase
    onMount(async () => {
        // Récupérer les tâches
        const { data: tasksData, error: tasksError } = await supabase
            .from('tasks')
            .select('*, categories (name)')
            .order('created_at', { ascending: false });

        if (tasksError) {
            console.error('Erreur lors de la récupération des tâches', tasksError);
        } else {
            tasks = tasksData || [];
        }

        const { data: categoriesData, error: categoriesError } = await supabase
            .from('categories')
            .select('*');

            if (categoriesError) {
                console.error('Erreur lors de la récupération des catégories', categoriesError);
            } else {
                categories = categoriesData || [];
                // Formater les catégories en AutocompleteOption<string>[]
                categoryOptions = categories
                    .filter(category => category.name) // Assurez-vous que le nom est présent
                    .map(category => ({
                        label: category.name,
                        value: category.name,    
                        keywords: category.name.toLowerCase()
                    }));
            }
        
    });

    // Fonction pour générer l'avatar de l'utilisateur
    const avatarUrl = (email) => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(email[0])}&background=random&color=fff&size=128`;
    };

    // Fonction pour définir la couleur en fonction de la priorité
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Basse':
                return 'bg-green-800';
            case 'Moyenne':
                return 'bg-orange-500';
            case 'Haute':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    // Filtrer les tâches en fonction des catégories sélectionnées
    $: filteredTasks = selectedCategories.length === 0
        ? tasks // Si aucune catégorie n'est sélectionnée, afficher toutes les tâches
        : tasks.filter(task => selectedCategories.includes(task.categories.name));

    // Fonction appelée lors de la sélection d'une catégorie dans Autocomplete
    const onInputChipSelect = (event) => {
        selectedCategories = [...selectedCategories, event.detail.value];
        inputChip = '';
    };
</script>

<main class="flex-grow flex items-start justify-center p-8">
    <div class="flex-grow flex p-8 space-x-6">
        <!-- Liste des tâches sous forme d'Accordion -->
        <div class="w-4/5 bg-white p-6 shadow-md rounded-lg dark:bg-gray-800">
            <h2 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Liste des Tâches</h2>
            {#if filteredTasks.length > 0}
                <Accordion>
                    {#each filteredTasks as task}
                        <AccordionItem>
                            <svelte:fragment slot="lead">
                                <span class="badge variant-filled">
                                    {task.categories.name}
                                </span>
                                <span class={`badge rounded-full ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                </span>
                            </svelte:fragment>

                            <svelte:fragment slot="summary">
                                <div class="flex justify-between items-center">
                                    <h3 class="text-lg font-bold text-gray-700 dark:text-gray-300">{task.title}</h3>
                                </div>
                            </svelte:fragment>

                            <svelte:fragment slot="content">
                                <p class="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
                                <p class="text-xs text-gray-400 dark:text-gray-500">
                                    Créée le {new Date(task.created_at).toLocaleDateString()}
                                </p>
                                <p class="text-xs text-gray-400 dark:text-gray-500">
                                    À faire avant le {new Date(task.due_date).toLocaleDateString()}
                                </p>
                            </svelte:fragment>
                        </AccordionItem>
                    {/each}
                </Accordion>
            {:else}
                <p class="text-gray-500 dark:text-gray-400">Aucune tâche disponible.</p>
            {/if}
        </div>

        <!-- Liste des catégories pour filtrer les tâches -->
        <div class="w-1/5 bg-gray-100 p-6 shadow-md rounded-lg dark:bg-gray-800">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Filtrer par Catégories</h2>
            <div class="pt-4">
                <InputChip placeholder="Besoin d’un filtre ? C’est par ici." bind:input={inputChip} bind:value={selectedCategories} name="chips" />
                <div class="pt-4">
                    <div class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto" tabindex="-1">
                        <Autocomplete
                            bind:input={inputChip}
                            options={categoryOptions}
                            denylist={selectedCategories}
                            on:selection={onInputChipSelect}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>

    {#if showModal}
        <div
            class="fixed inset-0 bg-black bg-opacity-50 z-40"
            role="button"
            tabindex="0"
            aria-label="Fermer le modal"
            on:click={closeModal}
            on:keydown={handleKeyDown}>
        </div>

        <div class="fixed z-50 max-w-lg p-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
            <div class="mt-4">
                {#if showSignUp}
                    <Signup {closeModal} />
                {:else}
                    <Login {closeModal} />
                {/if}
            </div>
        </div>
    {/if}
</main>