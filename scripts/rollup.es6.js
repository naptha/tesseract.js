import commonjs from "rollup-plugin-commonjs";
// import { terser } from "rollup-plugin-terser";
// import copy from "rollup-plugin-copy";

export default [
  {
    input: "dist/tesseract.min.js",
    output: {
      file: "dist/tesseract.es6.min.js",
      format: "esm",
      banner: "/* eslint-disable */",
    },
    plugins: [commonjs()],
  },
];
