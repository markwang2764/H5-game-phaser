// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module"
  },
  env: {
    browser: true
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/reccommended` for stricter rules.
    // 'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    "standard"
  ],
  // required to lint *.vue files
  plugins: [
    // 'vue'
  ],
  // add your custom rules here
  rules: {
    semi: [2, "always"], //语句强制分号结尾
    // allow trailing-spaces
    "no-trailing-spaces": "off",
    // allow async-await
    "generator-star-spacing": "off",
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  },
  globals: {
    $: true,
    Zepto: true,
    localStorage: true,
    alert: true,
    createjs: true,
    lib: true,
    anime: true,
    CREATE: true,
    Loader: true,
    CFG: true,
    wx: true
  }
};
