<template>
  <button
    class="button block p-2 bg-gray-200 hover:bg-gray-300"
    @click="signOut"
    :disabled="loading"
  >
    Log out
  </button>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const { $supabase } = useNuxtApp();
    const loading = ref(false);

    // why not...
    async function signOut() {
      try {
        loading.value = true;
        const { error } = await $supabase.auth.signOut();
      } catch (error) {
        alert(error.error_description || error.message);
      } finally {
        console.log("success");
        loading.value = false;
      }
    }

    return {
      loading,
      signOut,
    };
  },
};
</script>
