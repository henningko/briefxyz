<template>
  <div>
    <TextMarkup
      @update:todos="(newObj) => (markup.todos = newObj)"
      @update:highlights="(newObj) => (markup.highlights = newObj)"
    >
      <div class="content-grid">
        <template v-for="content in data" :key="content.id">
          <!-- blurb -->
          <div
            class="content-container"
            v-if="content.type == 'blurb'"
            :data-content-id="content.id"
          >
            <h1>{{ content.title }}</h1>
            <div
              v-html="
                content.format == 'text/markdown' && content.content
                  ? $markdown(content.content)
                  : content.content
              "
            ></div>
          </div>
          <!-- articles -->
          <article
            v-if="content.type == 'article'"
            class="content-container"
            :data-content-id="content.id"
          >
            <h1>{{ content.title }}</h1>
            <main
              v-html="
                content.format == 'text/markdown' && content.content
                  ? $markdown(content.content)
                  : content.content
              "
            ></main>
          </article>
        </template>
      </div>
    </TextMarkup>
    <!-- Anything marked for follow up // todos and notes -->
    <div>
      <h1>Follow Up Items</h1>
      <em
        v-if="
          Object.keys(markup.highlights).length == 0 &&
          Object.keys(markup.todos).length == 0
        "
        >No markups have been created. Create highlights and to dos by selecting
        and marking text.</em
      >
      <template v-else>
        <h2 v-if="Object.keys(markup.highlights).length > 0">Notes</h2>
        <ul v-for="(highlights, key) in markup.highlights">
          <h3>
            <a :href="contentById(key)[0]['target_url']">
              {{ contentById(key)[0]["title"] }}
            </a>
          </h3>
          <li v-for="highlight in highlights">
            {{ highlight.comment }}
            <blockquote>
              {{ highlight.text }}
            </blockquote>
          </li>
        </ul>
        <h2 v-if="Object.keys(markup.todos).length > 0">To Dos</h2>
        <ul v-for="(todos, key) in markup.todos">
          <h3>
            <a :href="contentById(key)[0]['target_url']">
              {{ contentById(key)[0]["title"] }}
            </a>
          </h3>
          <li v-for="todo in todos">
            {{ todo.comment }}
            <blockquote>
              {{ todo.text }}
            </blockquote>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import TextMarkup1 from "~~/components/TextMarkup.vue";
definePageMeta({
  middleware: "auth",
  layout: "app",
});
const client = useSupabaseClient();
const { $markdown } = useNuxtApp();
const markup = reactive({
  highlights: {},
  todos: {},
});
// const todos = reactive({});

// Get most recent digest
const { data: digest } = await client
  .from("user_digests")
  .select("id")
  .order("created_at", { ascending: false })
  .range(0, 1);

// Get data with most recent digest
const { data } = await client
  .from("user_content_queue")
  .select("title, content, type, target_url, format, priority, id")
  .order("type", { ascending: false })
  .order("priority", { ascending: true })
  .eq("digest_id", digest[0].id);

const contentById = (id) => {
  const content = data.filter((content) => content.id == id);
  return content;
};
</script>

<style scoped>
.content-grid > div,
.content-grid > article {
  border-bottom: 1px solid var(--secondary-color);
  padding: var(--spacing-xl) 0;
}
@media screen and (min-width: 768px) {
  .content-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0 var(--spacing-xl);
  }

  article {
    grid-column: span 3;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0 var(--spacing-xl);
  }
  article h1 {
    grid-column: span 3;
  }
  article main {
    grid-column-start: 1;
    grid-column-end: span 2;
  }
}
</style>
