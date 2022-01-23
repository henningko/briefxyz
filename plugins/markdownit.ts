import { defineNuxtPlugin, NuxtApp } from "#app";
import mdit from "markdown-it";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      markdown: new mdit({
        html: true,
        linkify: false,
        typographer: true,
      }),
    },
  };
});
