import { defineNuxtPlugin } from "#app";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export default defineNuxtPlugin(() => {
  return {
    provide: {
      supabase: createClient(supabaseUrl, supabaseKey),
    },
  };
});
