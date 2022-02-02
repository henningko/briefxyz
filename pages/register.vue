<template>
  <div>
    <h1>Sign Up</h1>
    <form
      class="row flex flex-center"
      @submit.prevent="handleSignup"
      v-if="!signedUp"
    >
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
          class="button block p-2 dark:bg-black dark:text-white dark:border dark:border-white dark:hover:bg-cool-gray-800"
          :value="loading ? 'Loading' : 'Sign Up'"
          :disabled="loading"
        />
      </div>
    </form>
    <div v-else>Please check your email for an activation link.</div>
  </div>
</template>

<script setup>
const { $supabase } = useNuxtApp();
const loading = ref(false);
const email = ref("");
const password = ref("");
const signedUp = ref(false);

const handleSignup = async () => {
  try {
    loading.value = true;
    const { error } = await $supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });
    await $fetch("api/auth", {
      method: "POST",
      body: { event, session },
    });
    if (error) throw error;
  } catch (error) {
    alert(error.error_description || error.message);
  } finally {
    loading.value = false;
    signedUp.value = true;
  }
};

//     return {
//       loading,
//       email,
//       password,
//       handleSignup,
//     };
//   },
// };
</script>
