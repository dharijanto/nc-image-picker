const fs = require('fs')

const browserify = require('browserify')
const log = require('fancy-log')
const tsify = require('tsify')
const watchify = require('watchify')

// Use --watch to watch for file changes
const argv = require('minimist')(process.argv.slice(2))
const WATCH = argv.watch || false

if (!WATCH) {
  log('Run with --watch in order to watch for file changes.')
} else {
  log(`Running in watch mode. Will recompile when there're file changes.`)
}

const b = browserify(['./main.ts', './index.d.ts'], {cache: {}, packageCache: {}, debug: true, plugin: [ WATCH? watchify : null ]})
          .transform({global: true}, 'browserify-shim')
          .plugin(tsify, {target: 'es6', files: []})
          .transform('babelify', {presets: ['es2015']})
b.on('update', () => {
  log('File change detected!')
  bundle(b)
})

// We need to invoke bundle at least once, in order for watchify to emit 'update' for changes
bundle(b)
  
function bundle (b) {
  log('Compiling....')
  b.bundle()
    .on('error', err => console.error(err.message))
    .pipe(fs.createWriteStream('./dist/nc-image-picker.js'))
    .on('finish', () => {
      log(`Finished Bundling module!`)
    })
}
