<template>
  <NuxtPage />
</template>
<script setup lang="ts">
import "./assets/css/global.css";
const { $supabase } = useNuxtApp();
const loading = ref(false);
const auth = useAuth();

auth.value.user = $supabase.auth.user();
$supabase.auth.onAuthStateChange(async (event, session) => {
  // Without this, an error was caused because session was null
  if (event === "SIGNED_IN") {
    auth.value.user = session.user;
  } else {
    auth.value.user = null;
  }
  await $fetch("api/auth", {
    method: "POST",
    body: { event, session },
  });
});
</script>
