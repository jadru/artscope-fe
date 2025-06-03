import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import tseslint from 'typescript-eslint';

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
})
 
const eslintConfig = [
  ...compat.config({
    extends: ['eslint:recommended', 'next'],
  }),
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      'no-undef': 'warn',
      'no-unused-vars': 'warn',
    },
  }
]
 
export default eslintConfig