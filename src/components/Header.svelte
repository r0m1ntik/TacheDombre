<script lang="ts">
    import AuthMenu from './AuthMenu.svelte';
    export let currentUser = null;
</script>

<header class="bg-white dark:bg-gray-900 w-full z-20 top-0 border-b border-gray-200 dark:border-gray-600">
    <div class="pr-20 pl-16 flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="/logo.png" class="h-8" alt="Logo Tâches de l'Ombre">
            <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Tâches de l'Ombre</span>
        </a>
        <AuthMenu {currentUser} />
    </div>
</header>