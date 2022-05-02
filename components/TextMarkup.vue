<template>
  <div
    class="floatingmenu"
    v-show="showMarkupMenu"
    :style="{ left: `${x}px`, top: `${y}px` }"
  >
    <input
      placeholder="add comment here"
      type="text"
      name="comment"
      id="highlight-comment-input"
      v-model="inputComment"
    />
    <button @click="textAction('highlight', $event)">Highlight</button>
    <button @click="textAction('todo', $event)">To-Do</button>
  </div>
  <div
    class="floatingmenu"
    v-show="showLinkMenu"
    :style="{ left: `${x}px`, top: `${y}px` }"
  >
    <button @click="textAction('highlight-link', $event)">Highlight</button>
    <button @click="textAction('add-link', $event)">Add to Reading List</button>
  </div>
  <div @mouseup="mark" @touchend="mark" @click="checkLink">
    <slot />
  </div>
</template>

<script setup lang="ts">
const client = useSupabaseClient();
const emit = defineEmits(["update:highlights", "update:todos"]);
const highlights = ref({});
const toDos = ref({});

const showMarkupMenu = ref(false);
const showLinkMenu = ref(false);
const x = ref(0);
const y = ref(0);

const inputComment = ref("");
let range;
let tempWrap;
let linkEl;

const textAction = async (action, event) => {
  let markContentId;
  let el;
  if (action == "add-link") {
    const { data: user, error } = await client.functions.invoke("add", {
      body: JSON.stringify({ url: linkEl.href }),
    });
  }
  if (action == "highlight-link") {
    el = linkEl;
    console.log(el);
    while (el != null && !el.dataset?.contentId) {
      el = el.parentElement;
    }
    if (el.dataset?.contentId) {
      markContentId = el.dataset.contentId;
    } else {
      markContentId = "none";
    }
    let id;
    highlights["value"][markContentId] =
      highlights["value"][markContentId] || [];
    id = `highlight-${markContentId}-${highlights["value"][markContentId].length}`;
    highlights["value"][markContentId].push({
      id: id,
      comment: "Highlighted Link",
      text: linkEl.href,
    });
    showLinkMenu.value = false;
    emit("update:highlights", highlights);
  } else {
    el = range.commonAncestorContainer.parentElement;
    while (el != null && !el.dataset?.contentId) {
      el = el.parentElement;
    }
    // set contentId for current markup
    if (el.dataset?.contentId) {
      markContentId = el.dataset.contentId;
    } else {
      markContentId = "none";
    }
    let id;
    if (action === "highlight") {
      // If no highlights  exist for content, create new array
      highlights["value"][markContentId] =
        highlights["value"][markContentId] || [];
      id = `highlight-${markContentId}-${highlights["value"][markContentId].length}`;
      highlights["value"][markContentId].push({
        id: id,
        comment: inputComment.value ?? "",
        text: range.toString(),
      });
      emit("update:highlights", highlights);
      // highlights.value[markContentId] = highlightsArr;
    } else if (action === "todo") {
      toDos["value"][markContentId] = toDos["value"][markContentId] || [];
      id = `todo-${markContentId}-${toDos["value"][markContentId].length}`;
      toDos["value"][markContentId].push({
        id: id,
        comment: inputComment.value ?? "",
        text: range.toString(),
      });
      emit("update:todos", toDos);
    }
    let wrap = document.createElement("mark");
    wrap.id = id;
    wrap.classList.add(`mark--${action}`);
    range.surroundContents(wrap);
    document.getSelection().removeAllRanges();
    tempWrap.replaceWith(...tempWrap.childNodes);
    showMarkupMenu.value = false;
    inputComment.value = "";
  }
  // Move up the DOM to find the contentId, if it exists
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
    // Todo this can possibly be made even better by looping through nodes
    // capturing also more deeply nested nodes
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
      if (window.innerWidth <= 480) {
        x.value = 0;
      } else {
        x.value = rectX + width / 2 > 220 ? rectX + width / 2 : 220;
      }
      y.value = rectY + window.scrollY;
      showMarkupMenu.value = true;
      if (tempWrap) {
        tempWrap.replaceWith(...tempWrap.childNodes);
      }
      tempWrap = document.createElement("mark");
      tempWrap.classList.add("selection");
      range.surroundContents(tempWrap);
      document.getSelection().removeAllRanges();
    }
  } else {
    showMarkupMenu.value = false;
    showLinkMenu.value = false;
    // Required to remove selection
    if (tempWrap) {
      tempWrap.replaceWith(...tempWrap.childNodes);
    }
  }
};

const checkLink = (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    event.preventDefault();
    showLinkMenu.value = true;
    linkEl = event.target;
    // TODO make this less hacky
    if (event.layerX < 150) {
      x.value = 150;
    } else if (event.layerX + 130 < window.innerWidth) {
      x.value = event.layerX - 130;
    }
    y.value = event.layerY + 10;
  }
};
</script>

<style scoped>
.floatingmenu {
  display: flex;
  /* font-size: 0.825rem; */
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif;
  gap: 1px;
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-50%, 0.5rem);
  overflow: hidden;
  line-height: 2rem;
  background-color: rgb(88, 94, 111);
  white-space: nowrap;
  overflow-x: scroll;
  color: white;
  border-radius: 4px;
  /* @apply shadow-md text-white rounded-lg; */
}
@media (max-width: 480px) {
  .floatingmenu {
    max-width: calc(100% - 2rem);
    margin-left: 1rem;
    margin-right: 1rem;
    transform: none;
  }
}
.floatingmenu button:hover,
.floatingmenu button:focus {
  background-color: rgba(107, 114, 128);
}
.floatingmenu button {
  background-color: rgb(38, 38, 38);
  border-radius: 0;
  padding: 0.25rem 0.5rem;
  border: none;
  outline: none;
  /* @apply pl-4 pr-4 hover:bg-cool-gray-500; */
}
.floatingmenu input {
  border-radius: 0;
  border: none;
  outline: none;
}

.floatingmenu input {
  min-width: 6rem;
  flex-shrink: 1;
  background-color: rgb(38, 38, 38);
  font-size: 16px;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  /* @apply pl-2 pr-2; */
}
</style>
<style>
mark {
  color: inherit;
  background-color: rgba(234, 78, 255, 0.5);
}

mark.selection {
  background-color: rgba(78, 158, 255, 0.5);
}
</style>
