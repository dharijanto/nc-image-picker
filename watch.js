const fs = require('fs')
const browserify = require('browserify')
const tsify = require('tsify')
const watchify = require('watchify')

const b = browserify(['./main.ts', './index.d.ts'], {cache: {}, packageCache: {}, debug: true})
          .plugin(watchify)
          .transform({global: true}, 'browserify-shim')
          .plugin(tsify, {target: 'es6', files: []})
          .transform('babelify', {presets: ['es2015']})
b.on('update', () => bundle(b))

// We need to invoke bundle at least once, in order for watchify to emit 'update' for changes
bundle(b)
  
function bundle (b) {
  console.log('Bundling....')
  b.bundle()
    .on('error', err => console.error(err.message))
    .pipe(fs.createWriteStream('./build/image-picker-bundle.js'))
    .on('finish', () => {
      console.log(`Finished Bundling module!`)
    })
}
