<script lang="ts">
	import Header from '../components/Header.svelte';
	import Main from '../components/Main.svelte';
    import Footer from '../components/Footer.svelte';
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

<!-- Structure de la page avec header, main et footer -->
<div class="flex flex-col min-h-screen">

    <!-- Header -->
    <Header {toggleModal} />

    <!-- Main -->
    <Main {showModal} {showSignUp} {closeModal} {handleKeyDown} />
	
	<!-- Footer -->
	<Footer />
</div>