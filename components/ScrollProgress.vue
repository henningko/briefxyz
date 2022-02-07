<template>
  <div class="progress">
    <div :style="{ width: scrolled + '%' }"></div>
  </div>
</template>
<script setup lang="ts">
let scrolled = ref(0.0);
onMounted(() => {
  window.addEventListener("scroll", () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    scrolled.value = (winScroll / height) * 100;
  });
});
</script>
<style scoped>
.progress {
  width: 100%;
  height: 0.25rem;
  position: sticky;
  top: 0;
  left: 0;
  @apply bg-black dark:bg-white;
}
.progress > div {
  position: absolute;
  height: 100%;
  @apply dark:bg-cool-gray-500 bg-white;
}
</style>
