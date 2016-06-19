import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/caritat.js',
  dest: 'dist/caritat.js',
  format: 'umd',
  sourceMap: true,
  external: ['lodash'],
  globals: {
    lodash: '_'
  },
  moduleName: 'caritat',
  plugins: [
    babel({
      'presets': ['es2015-rollup']
    }),
    uglify()
  ]
};
