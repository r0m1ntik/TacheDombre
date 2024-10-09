<script lang="ts">
    import { user, signOutUser } from '$lib/stores/userStore';
    import { popup } from '@skeletonlabs/skeleton';
    import type { PopupSettings } from '@skeletonlabs/skeleton';
    import { supabase } from '$lib/auth'; // Import Supabase pour modifier le nom d'utilisateur

    // Fonction pour ouvrir le modal avec un mode spécifique (connexion ou inscription)
    export let toggleModal: (signUp: boolean) => void;

    let currentUser;
    let newDisplayName = ''; // Variable pour stocker le nouveau nom d'affichage

    // Surveille les modifications du store utilisateur
    $: user.subscribe(value => {
        currentUser = value;
    });

    const handleSignOut = async () => {
        // Déconnecter l'utilisateur
        await signOutUser(); 
    };

    const popupFeatured: PopupSettings = {
        event: 'click',
        target: 'popupFeatured',
        placement: 'bottom',
    };

    const avatarUrl = (email) => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(email[0])}&background=random&color=fff&size=128`;
    };

    // Fonction pour mettre à jour le nom d'affichage
    const updateDisplayName = async () => {
        if (newDisplayName.trim()) {
            const { error } = await supabase.auth.updateUser({ data: { displayName: newDisplayName } });
            if (!error) {
                // Mettre à jour localement
                currentUser.user_metadata.displayName = newDisplayName;
                // Réinitialiser le champ de saisie
                newDisplayName = '';
            } else {
                console.error('Erreur lors de la mise à jour du nom', error);
            }
        }
    };
</script>

{#if currentUser}
    <button
        type="button"
        class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
        id="user-menu-button"
        use:popup={popupFeatured}
    >
        <span class="sr-only">Profil</span>
        <img class="w-8 h-8 rounded-full" src={avatarUrl(currentUser.email)} alt="">
    </button>

    <!-- Menu déroulant (popup) -->
    <div class="card p-4 w-72 shadow-xl" data-popup="popupFeatured">
        <div class="space-y-4">
            <div>
                <p class="font-bold">
                    <span class="block text-sm text-gray-900 dark:text-white">{currentUser.email}</span>
                </p>
                <p class="opacity-50">
                    {#if currentUser.user_metadata?.displayName}
                        <span class="block text-sm text-gray-900 dark:text-white">{currentUser.user_metadata.displayName}</span>
                    {:else}
                        <!-- Si le nom n'existe pas, proposer de le changer -->
                        <input type="text" bind:value={newDisplayName} placeholder="Entrez votre nom" class="input input-primary w-full" />
                        <button class="btn variant-soft w-full mt-2" on:click={updateDisplayName}>Modifier le nom</button>
                    {/if}
                </p>
            </div> 
            <div class="flex gap-4">
                <small>
                    <strong>100</strong>
                    <span class="opacity-50">Tâches créées</span>
                </small>
            </div>
            <button class="btn variant-soft w-full" on:click={handleSignOut}>Se déconnecter</button>
        </div>
    </div>
{:else}
    <ul class="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
        <li>
            <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" on:click={() => toggleModal(true)}>S'inscrire</button>
        </li>
        <li>
            <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" on:click={() => toggleModal(false)}>Se connecter</button>
        </li>
    </ul>
{/if}