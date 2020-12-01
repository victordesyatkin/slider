module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  //extends: ["airbnb-base"],
  parser: "@typescript-eslint/parser",
  extends: ["airbnb-base", "plugin:fsd/all"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: [
    //'@typescript-eslint',
    "fsd",
  ],
  rules: {
    "fsd/hof-name-prefix": "error",
    "fsd/no-heavy-constructor": "error",
    "fsd/jq-cache-dom-elements": "error",
    "fsd/jq-use-js-prefix-in-selector": "error",
    "fsd/no-function-declaration-in-event-listener": "error",
    "fsd/split-conditionals": "error",
  },
};
