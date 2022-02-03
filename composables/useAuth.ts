import type { Session } from "@supabase/supabase-js";

// const authenticated = ref<boolean>(false);

// session is null when not logged in
const userSession = ref<Session | null>(null);
const userCookieSet = ref<boolean | null>(null);

export default async () => {
  const isAuthenticated = () => {
    return userSession.value?.user && userCookieSet.value;
  };

  return {
    userSession,
    userCookieSet,
    isAuthenticated,
  };
};
