import stylistic from '@stylistic/eslint-plugin';
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import github from 'eslint-plugin-github';
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig(
    { ignores: ["dist/", "lib/", "node_modules/", "jest.config.js"] },
    [{
        plugins: {
            "@typescript-eslint": typescriptEslint,
            "@stylistic": stylistic,
        },
        languageOptions: {
            globals: {
                ...globals.node,
            },
            parser: tsParser,
            ecmaVersion: 9,
            sourceType: "module",
            parserOptions: {
                project: "./tsconfig.json",
            },
        },
        extends: [github.getFlatConfigs().recommended],
        files: ["**/*.ts"],
        ignores: ["**/*.test.ts"],
        rules: {
            camelcase: "off",
            semi: "off",
            "i18n-text/no-en": "off",
            "eslint-comments/no-use": "off",
            "import/no-namespace": "off",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "error",
            "@typescript-eslint/explicit-member-accessibility": ["error", {
                accessibility: "no-public",
            }],
            "@typescript-eslint/no-require-imports": "error",
            "@typescript-eslint/array-type": "error",
            "@typescript-eslint/await-thenable": "error",
            "@typescript-eslint/ban-ts-comment": "error",
            "@typescript-eslint/consistent-type-assertions": "error",
            "@typescript-eslint/explicit-function-return-type": ["error", {
                allowExpressions: true,
            }],
            "@stylistic/func-call-spacing": ["error", "never"],
            "@typescript-eslint/no-array-constructor": "error",
            "@typescript-eslint/no-empty-interface": "error",
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-extraneous-class": "error",
            "@typescript-eslint/no-for-in-array": "error",
            "@typescript-eslint/no-inferrable-types": "error",
            "@typescript-eslint/no-misused-new": "error",
            "@typescript-eslint/no-namespace": "error",
            "@typescript-eslint/no-non-null-assertion": "warn",
            "@typescript-eslint/no-unnecessary-qualifier": "error",
            "@typescript-eslint/no-unnecessary-type-assertion": "error",
            "@typescript-eslint/no-useless-constructor": "error",
            "@typescript-eslint/no-var-requires": "error",
            "@typescript-eslint/prefer-for-of": "warn",
            "@typescript-eslint/prefer-function-type": "warn",
            "@typescript-eslint/prefer-includes": "error",
            "@typescript-eslint/prefer-string-starts-ends-with": "error",
            "@typescript-eslint/promise-function-async": "error",
            "@typescript-eslint/require-array-sort-compare": "error",
            "@typescript-eslint/restrict-plus-operands": "error",
            "@stylistic/semi": ["error", "never"],
            "@stylistic/type-annotation-spacing": "error",
            "@typescript-eslint/unbound-method": "error",
        },
    }]);