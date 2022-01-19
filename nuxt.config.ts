import { defineNuxtConfig } from "nuxt3";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  // modules: ["nuxt3-supabase/module"],
  buildModules: ["nuxt-windicss"],
  // supabase: {
  //   url: process.env.SUPABASE_URL,
  //   key: process.env.SUPABASE_KEY,
  // },
  // publicRuntimeConfig: {
  //   publicUrl: process.env.PUBLIC_URL,
  //   supabaseUrl: process.env.SUPABASE_URL,
  //   supabaseKey: process.env.SUPABASE_KEY,
  // },
  // privateRuntimeConfig: {
  //   supabaseUrl: process.env.SUPABASE_URL,
  //   supabaseKey: process.env.SUPABASE_KEY,
  // },
});
