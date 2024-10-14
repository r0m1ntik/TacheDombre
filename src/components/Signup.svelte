<script lang="ts">
    import { goto } from '$app/navigation';
    import { signIn, signUp } from '$lib/stores/userStore';
    import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

    let emailSignUp = '';
    let passwordSignUp = '';
    let passwordConfirmationSignUp = '';  // Nouvelle variable pour la confirmation du mot de passe
    let errorMessageSignUp = '';
    let successMessageSignUp = '';
    let autoLogin = false;
    let showPassword = false;

    const handleSignUp = async () => {
        // Vérifier que les mots de passe correspondent
        if (passwordSignUp !== passwordConfirmationSignUp) {
            errorMessageSignUp = 'Les mots de passe ne correspondent pas.';
            return;
        }

        const result = await signUp(emailSignUp, passwordSignUp);

        if (result?.error) {
            errorMessageSignUp = translateError(result.error.message);
            successMessageSignUp = '';
        } else {
            errorMessageSignUp = '';
            successMessageSignUp = 'Compte créé avec succès !';

            if (autoLogin) {
                const loginResult = await signIn(emailSignUp, passwordSignUp);
                if (!loginResult?.error) {
                    goto('/dashboard');
                }
            }
        }
    };

    const translateError = (error) => {
        switch (true) {
            case /Password should be at least 6 characters/.test(error):
                return 'Le mot de passe doit comporter au moins 6 caractères.';
            case /Password should contain at least one character of each/.test(error):
                return 'Le mot de passe doit contenir au moins un caractère de chaque type : majuscule, minuscule, chiffre, et symbole.';
            case /Invalid email/.test(error):
                return 'Adresse e-mail invalide.';
            case /Email already exists/.test(error):
                return 'Cette adresse e-mail est déjà utilisée.';
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
        <h2 class="text-2xl font-semibold mb-6 text-center">Créer un compte</h2>
        <form on:submit|preventDefault={handleSignUp} class="flex flex-col gap-4">
            <label for="email" class="font-semibold">Email :</label>
            <input id="email" type="email" bind:value={emailSignUp} class="input input-primary" required />

            <!-- Mot de passe -->
            <label for="password" class="font-semibold">Mot de passe :</label>
            <div class="relative">
                {#if !showPassword}
                    <!-- Mot de passe masqué -->
                    <input id="password" type="password" bind:value={passwordSignUp} class="input input-primary w-full pr-10" required />
                {:else}
                    <!-- Mot de passe visible -->
                    <input id="password" type="text" bind:value={passwordSignUp} class="input input-primary w-full pr-10" required />
                {/if}
                <button type="button" on:click={togglePasswordVisibility} class="absolute right-2 top-2 text-sm text-gray-400">
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} class="w-5 h-6" />
                </button>
            </div>

            <!-- Confirmation du mot de passe -->
            <label for="password-confirmation" class="font-semibold">Confirmer le mot de passe :</label>
            <div class="relative">
                {#if !showPassword}
                    <!-- Mot de passe masqué -->
                    <input id="password-confirmation" type="password" bind:value={passwordConfirmationSignUp} class="input input-primary w-full pr-10" required />
                {:else}
                    <!-- Mot de passe visible -->
                    <input id="password-confirmation" type="text" bind:value={passwordConfirmationSignUp} class="input input-primary w-full pr-10" required />
                {/if}
                <button type="button" on:click={togglePasswordVisibility} class="absolute right-2 top-2 text-sm text-gray-400">
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} class="w-5 h-6" />
                </button>
            </div>

            <div class="flex items-center">
                <input type="checkbox" id="autoLogin" bind:checked={autoLogin} class="mr-2">
                <label for="autoLogin" class="text-sm text-gray-400">Se connecter automatiquement après l'inscription</label>
            </div>

            <button type="submit" class="btn variant-filled-surface mt-4">Créer un compte</button>

            {#if errorMessageSignUp}
                <aside class="alert variant-ghost mt-4">
                    <div class="alert-message">
                        <p>{errorMessageSignUp}</p>
                    </div>
                </aside>
            {/if}

            {#if successMessageSignUp && !autoLogin}
                <aside class="alert variant-success mt-4">
                    <div class="alert-message">
                        <p>{successMessageSignUp} Vous pouvez maintenant vous connecter.</p>
                    </div>
                </aside>
            {/if}
        </form>

        <!-- Ligne avec lien vers la connexion -->
        <p class="mt-6 text-center text-sm text-gray-500">
            Vous avez déjà un compte ? 
            <a href="/login" class="text-blue-500 hover:text-blue-700 font-semibold">Connectez-vous ici</a>.
        </p>
    </section>
</main>