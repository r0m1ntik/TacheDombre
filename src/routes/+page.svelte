<script lang="ts">
    import Header from '../components/Header.svelte';
    import Main from '../components/Main.svelte';
    import Footer from '../components/Footer.svelte';
    import { currentUser, loadUser } from '$lib/stores/userStore'; 
    import { onMount } from 'svelte';

    // Charger l'utilisateur à la montée du composant
    onMount(async () => {
        await loadUser();
    });
</script>

<!-- Structure de la page Principale -->
<div class="flex flex-col min-h-screen">
    <Header {currentUser} />
    <Main />
    <Footer />
</div>