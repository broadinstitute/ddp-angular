export default {
  entry: 'dist/index.js',
  dest: 'dist/bundles/umbrella-config.umd.js',
  sourceMap: false,
  external: ['@angular/core'],
  format: 'umd',
  moduleName: 'umbrella.config', // no dashes
  globals: {
    '@angular/core': 'ng.core'
  }
}
