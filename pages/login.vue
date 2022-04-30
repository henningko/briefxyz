<template>
  <form @submit.prevent="signIn">
    <h1>Login</h1>
    <div>
      <label for="login-form-email">Email:</label>
      <input type="text" name="email" id="login-form-email" v-model="email" />
    </div>
    <div>
      <label for="login-form-password">Password:</label>
      <input
        type="password"
        name="password"
        id="login-form-password"
        v-model="password"
      />
    </div>
    <button type="submit">Sign In</button>
    Don't have an account? <NuxtLink to="/register">Register here</NuxtLink>
  </form>
</template>

<script setup lang="ts">
const client = useSupabaseClient();
const user = useSupabaseUser();

const email = ref("");
const password = ref("");

const signIn = async () => {
  const { user, error } = await client.auth.signIn({
    email: email.value,
    password: password.value,
  });
  if (error) {
    alert(error);
  }
};

watchEffect(() => {
  if (user.value) {
    navigateTo("/");
  }
});
</script>

<style scoped></style>
