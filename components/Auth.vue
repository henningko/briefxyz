<template>
  <form class="row flex flex-center" @submit.prevent="handleLogin">
    <div class="col-6 form-widget">
      <input
        class="inputField border mt-4 mb-4 p-2 block"
        type="email"
        placeholder="Your email"
        v-model="email"
      />

      <input
        class="inputField border mt-4 mb-4 p-2 block"
        type="password"
        placeholder="Your password"
        v-model="password"
      />

      <input
        type="submit"
        class="button block p-2"
        :value="loading ? 'Loading' : 'Login'"
        :disabled="loading"
      />
    </div>
  </form>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const { $supabase } = useNuxtApp();
    const loading = ref(false);
    const email = ref("");
    const password = ref("");

    const handleLogin = async () => {
      try {
        loading.value = true;
        const { error } = await $supabase.auth.signIn({
          email: email.value,
          password: password.value,
        });
        if (error) throw error;
      } catch (error) {
        alert(error.error_description || error.message);
      } finally {
        console.log("success");
        loading.value = false;
      }
    };

    return {
      loading,
      email,
      password,
      handleLogin,
    };
  },
};
</script>
