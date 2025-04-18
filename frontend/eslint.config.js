import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  // Vue Recommended
  ...pluginVue.configs['flat/essential'],
  ...pluginVue.configs['flat/strongly-recommended'],
  ...pluginVue.configs['flat/recommended'],

  // Custom Config
  {
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser
      }
    },
    rules: {
      // buraya özel eslint kurallarını yazabilirsin, örnek:
      // 'no-console': 'warn'
    }
  }
]
