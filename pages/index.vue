<template>
  <div class="w-full min-h-screen bg-white dark:bg-black dark:text-white p-8">
    <div v-if="isAuthenticated()">
      <Logout />
      <h1 class="text-7xl font-bold mb-8">Brief.</h1>
      <Content />
    </div>
    <Auth v-else />
  </div>
</template>
<script setup lang="ts">
const { $supabase } = useNuxtApp();
const loading = ref(false);
const { isAuthenticated } = await useAuth();
</script>
