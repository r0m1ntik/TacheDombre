<script lang="ts">
    import { signIn } from '$lib/auth';
    import { user } from '$lib/stores/userStore';
    import { fade } from 'svelte/transition';

    let emailSignIn = '';
    let passwordSignIn = '';
    let errorMessageSignIn = '';
    export let closeModal;

    const handleSignIn = async () => {
        const result = await signIn(emailSignIn, passwordSignIn);
        if (result.error) {
            errorMessageSignIn = translateError(result.error.message);
        } else {
            user.set(result.data.user);
            closeModal();
        }
    };

    const translateError = (error) => {
        switch (true) {
            case /Invalid email or password/.test(error):
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
</script>

<section class="mb-6">
    <h2 class="text-2xl mb-4">Connexion</h2>
    <form on:submit|preventDefault={handleSignIn} class="flex flex-col gap-4">
        <label for="email">Email :</label>
        <input id="email" type="email" bind:value={emailSignIn} class="input input-primary" required />

        <label for="password">Mot de passe :</label>
        <input id="password" type="password" bind:value={passwordSignIn} class="input input-primary" required />

        <button type="submit" class="btn variant-filled-surface">Se connecter</button>

        {#if errorMessageSignIn}
            <aside class="alert variant-ghost" transition:fade={{ duration: 200 }}>
                <div class="alert-message">
                    <p>{errorMessageSignIn}</p>
                </div>
            </aside>
        {/if}
    </form>
</section>