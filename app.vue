<template>
  <ScrollProgress />
  <Html lang="'en-US'">
    <Head>
      <Title>Brief</Title>
      <Meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  </Html>
  <NuxtPage />
</template>
<script setup lang="ts">
import "./assets/css/global.css";
const { $supabase } = useNuxtApp();
const loading = ref(false);
const { userSession, userCookieSet } = useAuth();

// Initial setup
userSession.value = await $supabase.auth.session();
if (userSession.value) {
  ({ auth: userCookieSet.value } = await $fetch("api/auth", {
    method: "POST",
    body: { session: userSession.value, event: "TOKEN_REFRESHED" },
  }));
}
$supabase.auth.onAuthStateChange(async (event, session) => {
  userSession.value = session;
  // Cookie will get updated by api/auth
  ({ auth: userCookieSet.value } = await $fetch("api/auth", {
    method: "POST",
    body: { event, session },
  }));
});
</script>
