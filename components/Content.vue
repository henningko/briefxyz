<template>
  <div>
    <p v-for="highlight in highlights">{{ highlight.text }}</p>
  </div>
  <ul class="sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-x-16">
    <template v-for="(content, index) in data" :key="index">
      <li
        class="border-t pt-8 pb-8 border-t-gray-30"
        v-if="content.type === 'blurb'"
      >
        <section>
          <h1>{{ content.title }}</h1>
          <span v-html="content.content"></span>
        </section>
      </li>
      <li
        class="col-span-2 lg:col-span-3 border-t pt-8 pb-8 border-t-gray-300"
        v-if="content.type === 'article'"
      >
        <article
          class="col-span-3 lg:grid lg:grid-cols-3 grid-flow-row-dense gap-x-16"
          @mouseup="mark"
        >
          <h1 class="col-span-3">
            {{ content.title }}
          </h1>
          <aside class="col-start-3 text-gray-500">
            <a :href="content.target_url">{{ content.target_url }}</a>
          </aside>
          <main class="col-span-2" v-html="content.content"></main>
        </article>
      </li>
    </template>
  </ul>
</template>

<script setup lang="ts">
const { $supabase } = useNuxtApp();
const data = await $fetch("/api/get");

let highlights = ref([]);

const mark = (event) => {
  const selection = document.getSelection();
  // Only do this if it's not an empty selection
  if (!selection.isCollapsed) {
    const range = selection.getRangeAt(0);
    let isValidSelection = false;
    console.log(range);
    let startNode = range.startContainer.parentNode;
    let endNode = range.endContainer.parentNode;
    // Check if invalid selection can be made valid through expansion
    if (startNode != endNode) {
      if (startNode == endNode.parentNode) {
        range.setEndAfter(endNode);
        endNode = range.endContainer.parentNode;
        isValidSelection = true;
      } else if (startNode.parentNode == endNode) {
        range.setStartBefore(startNode);
        startNode = range.startContainer.parentNode;
        isValidSelection = true;
      } else {
        isValidSelection = false;
      }
    } else {
      isValidSelection = true;
    }
    if (isValidSelection) {
      const id = `highlight-${highlights.value.length}`;
      let wrap = document.createElement("mark");
      wrap.id = id;
      range.surroundContents(wrap);
      highlights.value.push({ id: id, text: range.toString() });
    }
  }
};
</script>
