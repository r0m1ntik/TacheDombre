<script lang="ts">
    import Signup from '../components/Signup.svelte';
    import Login from '../components/Login.svelte';
    import AuthMenu from '../components/AuthMenu.svelte';
    import { loadUser, signOutUser } from '$lib/stores/userStore'; // Importer la fonction signOutUser pour gérer la déconnexion
    import { fade } from 'svelte/transition';

    let showSignUp = true;
    let showModal = false;

    // Charger la session utilisateur au démarrage de la page
    loadUser();

    // Fonction pour basculer l'affichage du modal
    const toggleModal = (signUp: boolean) => {
        showSignUp = signUp;
        showModal = true;
    };

    // Fonction pour fermer le modal
    const closeModal = () => showModal = false;

    // Gestion des événements clavier pour la fermeture du modal
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            closeModal();
        }
    };
</script>

<section class="p-8 max-w-xl mx-auto">
    <h1 class="text-3xl mb-4">Tâches de l'Ombre</h1>

    <!-- Utilisation du composant AuthMenu -->
    <AuthMenu {toggleModal} />

    {#if showModal}
        <div
            class="modal-backdrop"
            role="button"
            tabindex="0"
            aria-label="Fermer le modal"
            on:click={closeModal}
            on:keydown={handleKeyDown}>
        </div>
        <div class="modal card p-4 w-modal shadow-xl space-y-4">
            <div class="modal-content">
                <button class="modal-close" on:click={closeModal}>×</button>

                {#if showSignUp}
                    <Signup {closeModal} />
                {:else}
                    <Login {closeModal} />
                {/if}
            </div>
        </div>
    {/if}
</section>
