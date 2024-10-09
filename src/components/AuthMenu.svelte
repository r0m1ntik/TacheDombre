<script lang="ts">
    import { user, signOutUser } from '$lib/stores/userStore';
    import { fade } from 'svelte/transition';

    // Fonction pour ouvrir le modal avec un mode spécifique (connexion ou inscription)
    export let toggleModal: (signUp: boolean) => void;

    let currentUser;

    // Surveille les modifications du store utilisateur
    $: user.subscribe(value => {
        currentUser = value;
    });

    const handleSignOut = async () => {
        // Déconnecter l'utilisateur
        await signOutUser(); 
    };
</script>

{#if currentUser}
    <div class="flex justify-between mb-8">
        <p>Connecté en tant que {currentUser.email}</p>
        <button type="button" class="btn variant-filled-surface" on:click={handleSignOut}>Se déconnecter</button>
    </div>
{:else}
    <nav class="flex justify-around mb-8">
        <button type="button" class="btn variant-filled-surface" on:click={() => toggleModal(true)}>S'inscrire</button>
        <button type="button" class="btn variant-filled-surface" on:click={() => toggleModal(false)}>Se connecter</button>
    </nav>
{/if}