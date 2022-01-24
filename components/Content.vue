<template>
  <ul class="sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-x-16">
    <template v-for="(content, index) in data" :key="index">
      <li
        class="border-t pt-16 pb-16 border-t-gray-30"
        v-if="content.type === 'blurb'"
      >
        <section>
          <h1 class="text-4xl">{{ content.title }}</h1>
          <span v-html="$markdown.render(content.data)"></span>
        </section>
      </li>
      <li
        class="col-span-2 lg:col-span-3 border-t pt-16 border-t-gray-300"
        v-if="content.type === 'article'"
      >
        <article
          class="col-span-3 lg:grid lg:grid-cols-3 grid-flow-row-dense gap-x-16"
        >
          <h1 class="text-4xl col-span-3">
            {{ content.title }}
          </h1>
          <aside class="col-start-3 text-gray-500 text-sm">
            {{ content.target_url }}
          </aside>
          <main
            class="col-span-2"
            v-html="$markdown.render(content.data)"
          ></main>
        </article>
      </li>
    </template>
  </ul>
</template>

<script setup lang="ts">
const { $supabase, $$markdown } = useNuxtApp();
// const { $markdown } = useNuxtApp();s
const { data } = await $supabase
  .from("user_content")
  .select("title, data, type, target_url")
  .order("type", { ascending: false });
</script>

<style scoped>
article h1 {
  font-family: "Hoefler Text";
  font-style: italic;
  /* text-transform: capitalize; */
}
article p {
  /* margin-top: 1rem; */
  margin-bottom: 2rem;
  padding-right: 4rem;
}
article aside {
  /* margin-top: 1rem; */
  margin-bottom: 4rem;
}
</style>
