import mdit from "markdown-it";

const markdown = new mdit({
  html: true,
  linkify: false,
  typographer: true,
  breaks: true,
});

export default defineNuxtPlugin(() => {
  return {
    provide: {
      markdown: (text: string) => {
        return markdown.render(text);
      },
    },
  };
});
