import commonjs from '@rollup/plugin-commonjs';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default [
  {
    input: 'dist/tesseract.min.js',
    output: {
      file: 'dist/tesseract.esm.min.js',
      format: 'esm',
      sourcemap: true,
      banner: '/* eslint-disable */',
    },
    plugins: [commonjs(), sourcemaps()],
  },
];
