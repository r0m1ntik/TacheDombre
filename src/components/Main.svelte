<script lang="ts">
    import Signup from './Signup.svelte';
    import Login from './Login.svelte';

    export let showModal: boolean;
    export let showSignUp: boolean;
    export let closeModal: () => void;
    export let handleKeyDown: (e: KeyboardEvent) => void;
</script>

<main class="flex-grow flex items-center justify-center p-4">
    {#if showModal}
        <!-- Overlay et modal -->
        <div
            class="fixed inset-0 bg-black bg-opacity-50 z-40"
            role="button"
            tabindex="0"
            aria-label="Fermer le modal"
            on:click={closeModal}
            on:keydown={handleKeyDown}>
        </div>
        <div class="fixed z-50 max-w-lg p-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
            <div class="mt-4">
                {#if showSignUp}
                    <Signup {closeModal} />
                {:else}
                    <Login {closeModal} />
                {/if}
            </div>
        </div>
    {/if}
</main>