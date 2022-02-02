<template>
  <form class="row flex flex-center" @submit.prevent="handleLogin">
    <div class="col-6 form-widget">
      <input
        class="inputField border mt-4 mb-4 p-2 block dark:bg-black dark:text-white dark:border dark:border-white"
        type="email"
        placeholder="Your email"
        v-model="email"
      />

      <input
        class="inputField border mt-4 mb-4 p-2 block dark:bg-black dark:text-white dark:border dark:border-white"
        type="password"
        placeholder="Your password"
        v-model="password"
      />

      <input
        type="submit"
        class="button inline p-2 mr-2 dark:bg-black dark:text-white dark:border dark:border-white dark:hover:bg-cool-gray-800"
        :value="loading ? 'Loading' : 'Login'"
        :disabled="loading"
      />
      <NuxtLink class="inline" to="/register">Register</NuxtLink>
    </div>
  </form>
</template>

<script setup>
const { $supabase } = useNuxtApp();
const router = useRouter();
const loading = ref(false);
const email = ref("");
const password = ref("");
const signedUp = ref(false);

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
    loading.value = false;
    router.push("/");
  }
};
</script>
