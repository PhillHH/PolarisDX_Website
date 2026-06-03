// Ambient declaration for the CSS-only @fontsource side-effect import.
// Needed because tsconfig has `noUncheckedSideEffectImports: true` and the
// package ships only CSS + woff2 (no type declarations).
declare module '@fontsource-variable/inter'
