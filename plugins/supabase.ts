import { defineNuxtPlugin, NuxtApp } from "#app";
import { createClient } from "@supabase/supabase-js";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  // const supabase = createClient(config.supabaseUrl, config.supabaseKey);

  // nuxtApp.vueApp.provide("supabase", supabase);
  // nuxtApp.provide("supabase", supabase);
  return {
    provide: {
      supabase: createClient(config.supabaseUrl, config.supabaseKey),
    },
  };
});

// import { defineNuxtPlugin, NuxtApp } from "#app";
// import type { SupabaseClient } from "@supabase/supabase-js";
// import { createClient } from "@supabase/supabase-js";

// export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
//   const config = useRuntimeConfig();
//   const supabase = createClient(config.supabaseUrl, config.supabaseKey);

//   nuxtApp.vueApp.provide("supabase", supabase);
//   nuxtApp.provide("supabase", supabase);
// });

// declare module "#app" {
//   interface NuxtApp {
//     $supabase: SupabaseClient;
//   }
// }

// declare module "@nuxt/kit" {
//   interface PublicRuntimeConfig {
//     supabaseUrl: string;
//     supabaseKey: string;
//   }
//   interface PrivateRuntimeConfig {
//     supabaseUrl: string;
//     supabaseKey: string;
//   }
// }
