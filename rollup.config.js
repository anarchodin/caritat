import babel from 'rollup-plugin-babel';
import npm from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/caritat.js',
  dest: 'index.js',
  format: 'umd',
  moduleName: 'caritat',
  plugins: [
    npm(),
    babel({'plugins': [['lodash', {"id": "lodash-es"}]]})
  ]
};
