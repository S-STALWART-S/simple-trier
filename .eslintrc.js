const restrictedGlobals = require("confusing-browser-globals");

module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    mocha: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@cspell/recommended",
    "plugin:sonarjs/recommended",
  ],
  overrides: [
    {
      files: ["**/*.test.js"],
      env: {
        jest: true,
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  plugins: ["@cspell", "sonarjs"],
  rules: {
    "@cspell/spellchecker": [
      "warn",
      {
        ignoreImportProperties: false,
        ignoreImports: false,
      },
    ],
    "arrow-parens": "warn",
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    "no-delete-var": "warn",
    "no-restricted-globals": ["error"].concat(restrictedGlobals),
    "no-unused-expressions": 0,
    "no-unused-vars": [
      "warn",
      {
        args: "after-used",
        argsIgnorePattern: "^_",
        ignoreRestSiblings: true,
        vars: "all",
      },
    ],
    "no-use-before-define": [
      "error",
      {
        allowNamedExports: false,
        classes: true,
        functions: false,
        variables: false,
      },
    ],
    "no-var": "warn",
    "object-shorthand": ["error", "always"],
    quotes: ["warn", "double"],
    semi: ["error", "always"],
  }, //   "node/exports-style": ["error", "module.exports"],
  //   "node/file-extension-in-import": ["error", "always"],
  //   "node/prefer-global/buffer": ["error", "always"],
  //   "node/prefer-global/console": ["error", "always"],
  //   "node/prefer-global/process": ["error", "always"],
  //   "node/prefer-global/url-search-params": ["error", "always"],
  //   "node/prefer-global/url": ["error", "always"],
  //   "node/prefer-promises/dns": "error",
  //   "node/prefer-promises/fs": "error"
};
