/**
 * Una sola regla, a propósito: `react-hooks/rules-of-hooks`.
 *
 * El 4 de septiembre de 2026 el panel se quedó EN BLANCO para quien tenía
 * sesión. La causa fueron tres hooks declarados debajo del `if (!user) return`
 * de `AdminPanel`: sin usuario React corre N hooks y sale por ahí; con usuario
 * corre N+3, y el error #310 desmonta el árbol entero.
 *
 * Ni `tsc` ni `vite build` lo ven —es legal en TypeScript y compila— y desde
 * fuera solo se llega al formulario de acceso, así que el fallo empezaba justo
 * donde terminaba lo que se podía probar sin entrar. El plugin ya estaba
 * instalado; lo que faltaba era este archivo.
 *
 * ⚠️ No se amplía a un lint general. Cientos de avisos de estilo en un
 * repositorio que nunca los tuvo se ignoran en bloque, y con ellos se ignoraría
 * este. Una regla que siempre está en verde es una regla que se mira.
 */
import reactHooks from "eslint-plugin-react-hooks";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    ignores: ["dist/**", "node_modules/**"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { "react-hooks": reactHooks },
    rules: { "react-hooks/rules-of-hooks": "error" },
  },
];
