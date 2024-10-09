<script lang="ts">
    import { signUp } from '$lib/auth';
    import { user } from '$lib/stores/userStore';
    import { fade } from 'svelte/transition';

    let emailSignUp = '';
    let passwordSignUp = '';
    let errorMessageSignUp = '';
    export let closeModal;

    const handleSignUp = async () => {
        const result = await signUp(emailSignUp, passwordSignUp);
        if (result.error) {
            errorMessageSignUp = translateError(result.error.message);
        } else {
            // Auto-login après création de compte
            user.set(result.data.user);
            // Effacer les messages d'erreur
            errorMessageSignUp = ''; 

            // Fermeture du modal
            setTimeout(() => {
                closeModal();
            }, 1000);
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
</script>

<section class="mb-6">
    <h2 class="text-2xl mb-4">Inscription</h2>
    <form on:submit|preventDefault={handleSignUp} class="flex flex-col gap-4">
        <label for="email">Email :</label>
        <input id="email" type="email" bind:value={emailSignUp} class="input input-primary" required />

        <label for="password">Mot de passe :</label>
        <input id="password" type="password" bind:value={passwordSignUp} class="input input-primary" required />

        <button type="submit" class="btn variant-filled-surface">S'inscrire</button>

        {#if errorMessageSignUp}
            <aside class="alert variant-ghost" transition:fade={{ duration: 200 }}>
                <div class="alert-message">
                    <p>{errorMessageSignUp}</p>
                </div>
            </aside>
        {/if}
    </form>
</section>