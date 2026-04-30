import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";

export default {
  languageOptions: {
    globals: globals.browser
  },
  overrides: [
    {
      files: ["*.vue"], // Aplica as regras específicas ao Vue
      rules: {
        "vue/multi-word-component-names": "off"  // Desabilita a regra para nomes de componentes
      }
    }
  ],
  ...pluginJs.configs.recommended,
  ...pluginVue.configs["flat/essential"]
};