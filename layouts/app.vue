<template>
  <div>
    <header>
      <h1>Brief.</h1>
      <button @click="signOut">Sign Out</button>
    </header>
    <slot />
  </div>
</template>

<script setup>
const client = useSupabaseClient();
const signOut = async () => {
  await client.auth.signOut();
  navigateTo("/login");
};
</script>

<style scoped>
header {
  display: flex;
  align-items: flex-start;
}
header h1 {
  margin-bottom: 2rem;
  font-size: 3rem;
  line-height: 4rem;
  flex-grow: 2;
  text-transform: uppercase;
}
</style>
