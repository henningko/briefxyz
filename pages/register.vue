<template>
  <form @submit.prevent="signUp">
    <h1>Register</h1>
    <div>
      <label for="register-form-email">Email:</label>
      <input
        type="text"
        name="email"
        id="register-form-email"
        v-model="email"
      />
    </div>
    <div>
      <label for="register-form-password">Password:</label>
      <input
        type="password"
        name="password"
        id="register-form-password"
        v-model="password"
      />
    </div>
    <button type="submit" :disabled="loading">Sign Up</button>
    Already have an account? <NuxtLink to="/login">Sign In</NuxtLink>
    <div v-if="signedUp">
      Sign up successful. Please check your email to confirm the registration.
    </div>
  </form>
</template>

<script setup lang="ts">
const client = useSupabaseClient();

const email = ref("");
const password = ref("");
const loading = ref(false);
const signedUp = ref(false);

const signUp = async () => {
  loading.value = true;
  const { user, error } = await client.auth.signUp({
    email: email.value,
    password: password.value,
  });
  if (error) {
    alert(error);
  } else if (user) {
    signedUp.value = true;
  }
  loading.value = false;
};
</script>

<style scoped></style>
