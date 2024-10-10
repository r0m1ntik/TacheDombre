<script lang="ts">
    const version = import.meta.env.VITE_PACKAGE_VERSION;
</script>

<footer class="bg-white dark:bg-gray-900 w-full border-t border-gray-200 dark:border-gray-600">
    <div class="w-full max-w-screen-xl mx-auto p-4 md:py-8 flex flex-col items-center space-y-2">
        <!-- Lien vers le repository GitHub avec version dynamique -->
        <span class="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
            <a href="https://github.com/r0m1ntik/TacheDombre" class="hover:underline">GitHub</a> - Version {version}
        </span>
        <!-- Nom du projet avec lien et Mention légale -->
        <span class="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2024 Tâches de l'Ombre ™ - Tous droits réservés.
        </span>
    </div>
</footer>