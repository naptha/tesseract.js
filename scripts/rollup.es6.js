import commonjs from "rollup-plugin-commonjs";

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
