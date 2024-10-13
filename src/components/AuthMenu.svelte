<script lang="ts">
    import { loadUser, signOutUser } from '$lib/stores/userStore';
    import { popup } from '@skeletonlabs/skeleton';
    import type { PopupSettings } from '@skeletonlabs/skeleton';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let newDisplayName = '';
    let currentRoute = '';
    export let currentUser = null;

    // Charger l'utilisateur et obtenir la route actuelle
    onMount(async () => {
        await loadUser();
        currentRoute = window.location.pathname;
    });

    const handleSignOut = async () => {
        await signOutUser();
    };

    const popupFeatured: PopupSettings = {
        event: 'click',
        target: 'popupFeatured',
        placement: 'bottom',
    };

    // Fonction pour générer l'URL de l'avatar, en vérifiant que l'email est bien défini
    const avatarUrl = (email: string | undefined) => {
        if (!email || email.length === 0) {
            return ''; // Retourner une chaîne vide si l'e-mail n'est pas défini
        }
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(email[0])}&background=random&color=fff&size=128`;
    };

    const updateDisplayName = async () => {
        if (newDisplayName.trim()) {
            const { error } = await supabase.auth.updateUser({ data: { displayName: newDisplayName } });
            if (!error) {
                currentUser.update(user => ({
                    ...user,
                    user_metadata: { ...user.user_metadata, displayName: newDisplayName },
                }));
                newDisplayName = '';
            } else {
                console.error('Erreur lors de la mise à jour du nom', error);
            }
        }
    };

    const redirectToRegister = () => {
        goto('/register');
    };

    const redirectToLogin = () => {
        goto('/login');
    };
</script>

<!-- Affichage conditionnel selon l'état de connexion -->
{#if $currentUser}
    <div class="flex items-center md:order-2 space-x-1 md:space-x-2 rtl:space-x-reverse">
        {#if currentRoute === '/dashboard'}
            <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" on:click={() => goto('/')}>Retour à l'accueil</button>
        {:else}
            <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" on:click={() => goto('/dashboard')}>Tableau de bord</button>
        {/if}

        <button
            type="button"
            class="flex text-sm bg-gray-800 rounded-full"
            id="user-menu-button"
            use:popup={popupFeatured}
        >
            <span class="sr-only">Profil</span>
            <img class="w-8 h-8 rounded-full" src={avatarUrl($currentUser?.email)} alt="User Avatar">
        </button>
    </div>

    <!-- Menu déroulant (popup) -->
    <div class="card p-4 w-72 shadow-xl" data-popup="popupFeatured">
        <div class="space-y-4">
            <div>
                <p class="font-bold">
                    <span class="block text-sm">{$currentUser?.email}</span>
                </p>
                <p class="opacity-50">
                    {#if $currentUser?.user_metadata?.displayName}
                        <span class="block text-sm">{$currentUser.user_metadata.displayName}</span>
                    {:else}
                        <input type="text" bind:value={newDisplayName} placeholder="Modifier votre nom" class="input input-primary w-full" />
                        <button class="btn variant-soft w-full mt-2" on:click={updateDisplayName}>Modifier</button>
                    {/if}
                </p>
            </div>
            <button class="btn variant-soft w-full" on:click={handleSignOut}>Se déconnecter</button>
        </div>
    </div>
{:else}
    <div class="flex items-center md:order-2 space-x-1 md:space-x-2 rtl:space-x-reverse">
        <button class="text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center" on:click={redirectToLogin}>
            Se connecter
        </button>
        <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" on:click={redirectToRegister}>
            S'inscrire
        </button>
    </div>    
{/if}