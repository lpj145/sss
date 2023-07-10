const nodeResolve = require('@rollup/plugin-node-resolve')
const esbuild = require('rollup-plugin-esbuild')
const commonjs = require('@rollup/plugin-commonjs')
const json = require('@rollup/plugin-json')
const run = require('@rollup/plugin-run')
const defineConfig = require('rollup').defineConfig
const copy = require('rollup-plugin-copy')

export default defineConfig({
  input: 'src/main.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  plugins: [
    commonjs(),
    nodeResolve(),
    esbuild.default({
      target: 'esnext',
      tsconfig: 'tsconfig.json',
      // Add extra loaders
      loaders: {
        '.json': 'json',
      },
    }),
    json(),
    copy({
      targets: [
        {
          src: '/src/view/index.html',
          dest: 'dist',
        }
      ]
    }),
    run(),
  ],
})
