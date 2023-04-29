import Fs from 'fs'
import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import livereload from 'rollup-plugin-livereload'
import typescript from 'rollup-plugin-typescript'
import copy from 'rollup-plugin-copy'
import svg from 'rollup-plugin-svg'
import babel from '@rollup/plugin-babel'

/* Post CSS */
import postcss from 'rollup-plugin-postcss'
import cssnano from 'cssnano'

/* Inline to single html */
import htmlBundle from 'rollup-plugin-html-bundle'

const production = !process.env.ROLLUP_WATCH

export default [
  // ui
  {
    input: 'src/main.js',
    output: {
      file: 'dist/ui.bundle.js',
      format: 'iife',
      name: 'ui',
    },
    plugins: [
      // remove bundle when done
      { writeBundle () { Fs.unlinkSync('dist/ui.bundle.js') } },

      svelte({
        // enable run-time checks when not in production
        dev: !production
      }),

      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration —
      // consult the documentation for details:¡
      // https://github.com/rollup/plugins/tree/master/packages/commonjs
      resolve({
        browser: true,
        dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/'),
        extensions: ['.svelte', '.mjs', '.js', '.json', '.node']
      }),
      commonjs(),
      babel({ babelHelpers: 'bundled' }),
      svg(),
      postcss({
        extensions: ['.css'],
        plugins: [cssnano()]
      }),
      htmlBundle({
        template: 'src/assets/template.html',
        target: 'dist/index.html',
        inline: true
      }),
      copy({
        targets: [
          { src: 'src/manifest.json', dest: 'dist' },
        ]
      }),

      // In dev mode, call `npm run start` once
      // the bundle has been generated
      !production && serve(),

      // Watch the `dist` directory and refresh the
      // browser on changes when not in production
      !production && livereload('dist'),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser(),
    ],
    watch: {
      clearScreen: false
    }
  },

  // plugin
  {
    input: 'src/plugin.ts',
    output: {
      generatedCode: 'es5',
      file: 'dist/plugin.js',
      format: 'cjs',
      name: 'plugin',
    },
    plugins: [
      typescript({ target: 'es5' }),
      commonjs(),
      babel({ babelHelpers: 'bundled' }),
      production && terser()
    ]
  }
]

function serve () {
  let started = false

  return {
    writeBundle () {
      if (!started) {
        started = true
        require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true
        })
      }
    }
  }
}
