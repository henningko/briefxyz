<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
import "./assets/css/normalize.css";
import "./assets/css/global.css";

useHead({
  title: "Brief",
  viewport: "width=device-width, initial-scale=1",
});
</script>
