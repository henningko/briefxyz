import { defineNuxtPlugin, NuxtApp } from "#app";
import { createClient } from "@supabase/supabase-js";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  return {
    provide: {
      supabase: createClient(config.supabaseUrl, config.supabaseKey),
    },
  };
});
