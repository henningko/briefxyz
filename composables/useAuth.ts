import type { Session } from "@supabase/supabase-js";
const userSession = ref<Session | null>(null);
const userCookieSet = ref<boolean | null>(null);
const isAuthenticated = ref(false);

watch([userSession, userCookieSet], ([session, cookie]) => {
  if (session?.user && cookie) {
    isAuthenticated.value = true;
  } else {
    isAuthenticated.value = false;
  }
});

export default () => {
  return {
    userSession,
    userCookieSet,
    isAuthenticated,
  };
};
