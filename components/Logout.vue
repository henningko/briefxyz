<template>
  <div class="absolute top-8 right-8">
    <!-- <span> {{ auth.user.email }} </span> -->
    <button
      class="button block p-1 bg-white border border-black hover:bg-cool-gray-400 dark:border-white dark:bg-black dark:text-white"
      @click="signOut"
      :disabled="loading"
    >
      Sign Out
    </button>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const { $supabase } = useNuxtApp();
    const loading = ref(false);
    const auth = useAuth();

    // why not...
    async function signOut() {
      try {
        loading.value = true;
        const { error } = await $supabase.auth.signOut();
      } catch (error) {
        alert(error.error_description || error.message);
      } finally {
        loading.value = false;
      }
    }

    return {
      loading,
      auth,
      signOut,
    };
  },
};
</script>
