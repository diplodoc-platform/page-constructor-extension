#!/usr/bin/env node
const {build: esbuild} = require('esbuild');
const {sassPlugin} = require('esbuild-sass-plugin');
const {polyfillNode} = require('esbuild-plugin-polyfill-node');
const {processBuildMeta} = require('./utils/dev');
const {commonjs} = require('@hyrious/esbuild-plugin-commonjs');
const common = {
    bundle: true,
    sourcemap: true,
    tsconfig: './tsconfig.json',
    metafile: process.env.NODE_ENV === 'development'
};

const commonPlugin = {
  external: ['markdown-it', 'node:*'],
  define: {
      PACKAGE: JSON.stringify(require('../package.json').name),
  },
};

const nodePlugin = {
    ...common,
    entryPoints: ['src/plugin/index-node.ts'],
    platform: 'node',
    outfile: 'build/plugin/index-node.js',
    jsx: 'automatic',
    plugins: [
      {
        name: 'css-mock',
        setup(build) {
          // Перехватывает все запросы к CSS файлам
          build.onResolve({ filter: /\.(css|scss)$/ }, args => {
            return {
              path: args.path,
              namespace: 'css-mock',
            };
          });
  
          // Возвращает пустой модуль для CSS
          build.onLoad({ filter: /.*/, namespace: 'css-mock' }, () => {
            return {
              contents: 'module.exports = {};',
              loader: 'js',
            };
          });
        },
      },
    ],
    external: [
        // '@gravity-ui/page-constructor',
                // 'consolidated-events'
    ],
};

// Build browser plugin
const browserPlugin = {
  ...common,
  entryPoints: ['src/plugin/index.ts'],
  platform: 'browser',
  format: 'esm',
  outdir: 'build/plugin',
  plugins: [sassPlugin(), polyfillNode({
    polyfills: {
      fs: true,
      path: true,
      process: true,
      buffer: true,
      util: true,
    }
  }),],
  alias: {
    '~@diplodoc/transform/dist/css/yfm.css': '@diplodoc/transform/dist/css/yfm.css',
    '~@gravity-ui/uikit/styles/styles.css': '@gravity-ui/uikit/styles/styles.css',
    // 'react': 'node_modules/react/index.js',
    // 'react-dom': 'node_modules/react-dom/index.js'
  },
  external: [
      'node:*',
      'fs',
      'path',
      'react',
      'react-dom'
  ],
};

// Build runtime bundle for browser
const runtimeBundle = {
    ...common,
    entryPoints: ['src/runtime/index.tsx'],
    platform: 'browser',
    format: 'esm',
    outfile: 'build/runtime/index.js',
    metafile: true,
    // jsx: 'automatic',
    plugins: [
      sassPlugin(),
      // polyfillNode({
      //   polyfills: {
      //     fs: true,
      //     path: true,
      //     process: true,
      //     buffer: true,
      //     util: true,
      //   }
      // }),
    ],
    external: [
        // Mark @gravity-ui/page-constructor as external to avoid bundling it
        // '@gravity-ui/page-constructor',
        // 'react',
        // 'react-dom',
        // 'consolidated-events'
        'fs',
        'path'
    ],
    alias: {
      '~@diplodoc/transform/dist/css/yfm.css': '@diplodoc/transform/dist/css/yfm.css',
      '~@gravity-ui/uikit/styles/styles.css': '@gravity-ui/uikit/styles/styles.css',
      // 'react': require.resolve('react'),
      // 'react-dom': require.resolve('react-dom')
  },
    // minify: true,
};


build(nodePlugin);
build(browserPlugin);
build(runtimeBundle);

function build(config) {
  return esbuild(config)
      .then(async (result) => {
          const isDev = process.env.NODE_ENV === 'development';
          
          if (isDev) {
              await processBuildMeta(result, config);
          }
          
          return result;
      })
      .catch((e) => console.error(`Build error:`, e));
};