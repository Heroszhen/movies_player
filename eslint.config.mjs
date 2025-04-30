import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";


export default defineConfig([
  { files: ["assets/**/*.{js,mjs,cjs,jsx}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["assets/**/*.{js,mjs,cjs,jsx}"], 
    languageOptions: { 
      globals: {
        ...globals.browser,
        process: "readonly",
      },
    } 
  },
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  pluginReact.configs.flat.recommended,
  {
    ignores: [
      "assets/controllers/*.js",
      "assets/bootstrap.js",
      "*.json",
    ],
  },
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'no-var': 'error',
      'no-console': 'off',
      'semi': 'error',
      'no-undef': 'error',
      'no-multiple-empty-lines': 'error',
      'no-useless-return': 'warn',
      'react/prop-types': 'off',
      "no-empty": "off",
    },
  }
]);