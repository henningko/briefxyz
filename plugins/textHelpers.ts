export default defineNuxtPlugin(() => {
  return {
    provide: {
      url: (url: string) => {
        return new URL(url);
      },
      date: (timestampISO: string) => {
        return new Date(timestampISO);
      },
    },
  };
});
