<template>
  <div class="w-full min-h-screen bg-white dark:bg-black p-8">
    <h1 class="text-7xl font-bold dark:text-white">Brief.</h1>
    <!-- <NuxtPage /> -->
    <Logout v-if="stateStore.user" />
    <Auth v-else />
  </div>
</template>
<script>
import Auth from "./components/Auth.vue";
import Logout from "./components/Logout.vue";

export default {
  components: {
    Auth,
    Logout,
  },

  setup() {
    const { $supabase } = useNuxtApp();
    const loading = ref(false);

    // stateStore requires a function
    const stateStore = useState("stateStore", () => ({}));
    stateStore.value.user = $supabase.auth.user();
    $supabase.auth.onAuthStateChange((event, session) => {
      // Without this, an error was caused because session was null
      if (event === "SIGNED_IN") {
        stateStore.value.user = session.user;
      } else {
        stateStore.value.user = null;
      }
    });

    return {
      stateStore,
    };
  },
};
</script>
