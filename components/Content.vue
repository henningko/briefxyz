<template>
  <div
    class="floatingmenu"
    v-show="showMenu"
    :style="{ left: `${x}px`, top: `${y}px` }"
  >
    <div>
      <input
        placeholder="add comment"
        type="text"
        name="comment"
        id="highlight-comment-input"
        v-model="inputComment"
      />
    </div>
    <button @click="textAction('highlight', $event)">Highlight</button>
    <button @click="textAction('todo', $event)">To-Do</button>
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
          @touchend="mark"
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
    <li class="col-span-2 lg:col-span-3 border-t pt-8 pb-8 border-t-gray-300">
      <section>
        <h1>Follow Up Items</h1>
        <h2>Highlights</h2>
        <div v-for="highlight in highlights">
          <blockquote>
            {{ highlight.text }}
          </blockquote>
          {{ highlight.comment }}
        </div>
        <h2>To-Dos</h2>
        <ul class="todolist">
          <li v-for="toDo in toDos">
            <strong>{{
              toDo.comment ? toDo.comment : `${toDo.text.slice(0, 30)}…`
            }}</strong
            ><br />
            {{ toDo.text }}
          </li>
        </ul>
      </section>
    </li>
  </ul>
</template>

<script setup lang="ts">
const { $supabase } = useNuxtApp();
const data = await $fetch("/api/get");

const highlights = ref([]);
const toDos = ref([]);

const showMenu = ref(false);
const x = ref(0);
const y = ref(0);

const inputComment = ref("");

let range;
// This is not an elegant solution—the selection is dropped whenever we focus on the textfield in the floating menu.
// as a workaround, we create a temp wrapper
let tempWrap;

const textAction = (action, event) => {
  let id;
  if (action === "highlight") {
    id = `highlight-${highlights.value.length}`;
    highlights.value.push({
      id: id,
      comment: inputComment.value,
      text: range.toString(),
    });
  } else if (action === "todo") {
    id = `todo-${toDos.value.length}`;
    toDos.value.push({
      id: id,
      comment: inputComment.value,
      text: range.toString(),
    });
  }

  let wrap = document.createElement("mark");
  wrap.id = id;
  wrap.classList.add(`mark--${action}`);
  range.surroundContents(wrap);
  document.getSelection().removeAllRanges();
  showMenu.value = false;
  tempWrap.replaceWith(...tempWrap.childNodes);
  inputComment.value = "";
};

const mark = (event) => {
  const selection = document.getSelection();
  // Only do this if it's not an empty selection
  if (!selection.isCollapsed) {
    range = selection.getRangeAt(0);
    let isValidSelection = false;
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
      const { x: rectX, bottom: rectY, width } = range.getBoundingClientRect();
      x.value = rectX + width / 2 > 180 ? rectX + width / 2 : 180;
      y.value = rectY + window.scrollY;
      showMenu.value = true;
      if (tempWrap) {
        tempWrap.replaceWith(...tempWrap.childNodes);
      }
      tempWrap = document.createElement("mark");
      tempWrap.classList.add("selection");
      range.surroundContents(tempWrap);
      document.getSelection().removeAllRanges();
    }
  } else {
    showMenu.value = false;
    tempWrap.replaceWith(...tempWrap.childNodes);
  }
};
</script>
<style scoped>
.floatingmenu {
  display: flex;
  gap: 1px;
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-50%, 0.5rem);
  overflow: hidden;
  @apply bg-cool-gray-500 shadow-md text-white rounded;
}
.floatingmenu button {
  @apply p-1 pl-2 pr-2 bg-cool-gray-700 hover:bg-cool-gray-500;
}

.floatingmenu input {
  @apply bg-cool-gray-700 p-1 pl-2 pr-2;
}

.todolist li::before {
  content: "☐";
  display: inline-block;
  font-size: 1.5rem;
  width: 2rem;
  margin-left: -2rem;
}
.todolist li {
  margin-left: 2rem;
}
</style>
