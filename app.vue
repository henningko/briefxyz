<template>
  <div class="w-full min-h-screen bg-white dark:bg-black dark:text-white p-8">
    <div v-if="auth.user">
      <Logout />
      <h1 class="text-7xl font-bold mb-8">Brief.</h1>
      <Content />
    </div>
    <Auth v-else />
  </div>
</template>
<script setup lang="ts">
import "./assets/css/global.css";
const { $supabase } = useNuxtApp();
const loading = ref(false);
const auth = useAuth();

auth.value.user = $supabase.auth.user();
$supabase.auth.onAuthStateChange((event, session) => {
  // Without this, an error was caused because session was null
  if (event === "SIGNED_IN") {
    auth.value.user = session.user;
  } else {
    auth.value.user = null;
  }
});
</script>
