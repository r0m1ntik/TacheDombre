<script lang="ts">
    import Signup from '../components/Signup.svelte';
    import Login from '../components/Login.svelte';
    import AuthMenu from '../components/AuthMenu.svelte';
    import { loadUser } from '$lib/stores/userStore';

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

<nav class="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
	<div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
		<a href="https://tache-dombre.vercel.app/" class="flex items-center space-x-3 rtl:space-x-reverse">
			<img src="https://github.com/r0m1ntik/TacheDombre/blob/main/static/logo.svg" class="h-8" alt="">
			<span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Tâches de l'Ombre</span>
		</a>
		<AuthMenu {toggleModal} />
	</div>
</nav>

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
