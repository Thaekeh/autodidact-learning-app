module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  reloadOnPrerender: process.env.NODE_ENV === "development",
  debug: process.env.NODE_ENV === "development",
  localePath:
    typeof window === "undefined"
      ? require("path").resolve("./public/locales")
      : "/locales",
};
