<script lang="ts">
    import { goto } from '$app/navigation';
	import { signIn } from '$lib/stores/userStore';
    import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

    let emailSignIn = '';
    let passwordSignIn = '';
    let errorMessageSignIn = '';
    let showPassword = false;

    const handleSignIn = async () => {
        const result = await signIn(emailSignIn, passwordSignIn);

        if (result?.error) {
            errorMessageSignIn = translateError(result.error.message || result.error);
        } else {
            errorMessageSignIn = ''; // Réinitialiser les erreurs
            goto('/dashboard'); // Rediriger vers le tableau de bord si connexion réussie
        }
    };

    const translateError = (error) => {
        switch (true) {
            case /Invalid login credentials/.test(error):
                return 'Email ou mot de passe invalide.';
            case /Email not confirmed/.test(error):
                return 'Votre adresse e-mail n\'est pas encore confirmée.';
            case /Invalid email/.test(error):
                return 'Adresse e-mail invalide.';
            case /User not found/.test(error):
                return 'Utilisateur non trouvé.';
            case /Too many requests/.test(error):
                return 'Trop de tentatives de connexion. Veuillez réessayer plus tard.';
            default:
                return 'Une erreur est survenue. Veuillez réessayer.';
        }
    };

    const togglePasswordVisibility = () => {
        showPassword = !showPassword;
    };
</script>

<main class="flex-grow flex items-center justify-center p-8">
    <section class="container max-w-md mx-auto p-6 shadow-lg rounded-lg">
        <h2 class="text-2xl font-semibold mb-6 text-center">Connexion</h2>
        <form on:submit|preventDefault={handleSignIn} class="flex flex-col gap-4">
            <label for="email" class="font-semibold">Email :</label>
            <input id="email" type="email" bind:value={emailSignIn} class="input input-primary" required />

            <label for="password" class="font-semibold">Mot de passe :</label>

            <!-- Afficher soit le champ de mot de passe masqué soit visible selon showPassword -->
            <div class="relative">
                {#if showPassword}
                    <input id="password" type="text" bind:value={passwordSignIn} class="input input-primary w-full pr-10" required />
                {:else}
                    <input id="password" type="password" bind:value={passwordSignIn} class="input input-primary w-full pr-10" required />
                {/if}

                <button type="button" on:click={togglePasswordVisibility} class="absolute right-2 top-2 text-sm text-gray-400">
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} class="w-5 h-6" />
                </button>
            </div>

            <button type="submit" class="btn variant-filled-surface mt-4">Se connecter</button>

            {#if errorMessageSignIn}
                <aside class="alert variant-ghost mt-4">
                    <div class="alert-message">
                        <p>{errorMessageSignIn}</p>
                    </div>
                </aside>
            {/if}
        </form>

        <p class="mt-6 text-center text-sm text-gray-500">
            Pas encore de compte ? 
            <a href="/register" class="text-blue-500 hover:text-blue-700 font-semibold">Créez-en un ici</a>.
        </p>
    </section>
</main>