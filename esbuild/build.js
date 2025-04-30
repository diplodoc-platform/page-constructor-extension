#!/usr/bin/env node
const {build} = require('esbuild');
const {sassPlugin} = require('esbuild-sass-plugin');
const {inlineScss} = require('esbuild-inline-sass');

const {
    compilerOptions: {target},
} = require('../tsconfig.json');

const common = {
    bundle: true,
    sourcemap: true,
    target: target,
    tsconfig: './tsconfig.json',
};

const nodePlugin = {
    ...common,
    entryPoints: ['src/plugin/index-node.ts'],
    platform: 'node',
    // outfile: 'build/plugin/index-node.js',
    outdir: 'build/plugin',

    // jsx: 'automatic',
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
};

// Build browser plugin
const browserPlugin = {
  ...common,
  entryPoints: ['src/plugin/index.ts'],
  platform: 'browser',
  format: 'esm',
  outdir: 'build/plugin',
  plugins: [sassPlugin()],
  alias: {
      '~@diplodoc/transform/dist/css/yfm.css': '@diplodoc/transform/dist/css/yfm.css',
  },
  external: [
      'node:*',
  ],
};

// Build runtime bundle for browser
const runtimeBundle = {
    ...common,
    entryPoints: ['src/runtime/index.ts'],
    platform: 'browser',
    format: 'esm',
    outfile: 'build/runtime/index.js',
    jsx: 'automatic',
    plugins: [sassPlugin()],
    external: [
        // External dependencies that should not be bundled
        'react',
        'react-dom',
        '@gravity-ui/page-constructor',
    ],
    alias: {
      '~@diplodoc/transform/dist/css/yfm.css': '@diplodoc/transform/dist/css/yfm.css',
    },
};

// build({
//   ...common,
//   entryPoints: ['src/react/index.tsx'],
//   outfile: 'build/react/index.js',
//   platform: 'browser',
//   // external: ['react', 'react-popper', 'tabbable'],
//   plugins: [sassPlugin()],
//   external: [
//       // Mark @gravity-ui/page-constructor as external to avoid bundling it
//       // '@gravity-ui/page-constructor',
//       // 'react',
//       // 'react-dom',
//   ],
//   alias: {
//     '~@diplodoc/transform/dist/css/yfm.css': '@diplodoc/transform/dist/css/yfm.css',
// },
// });

// build({
//     ...common,
//     entryPoints: ['src/react/index.tsx'],
//     outfile: 'build/react/index.js',
//     platform: 'neutral',
//     external: ['react'],
//     jsx: 'automatic',

// });

build({
    ...common,
    entryPoints: ['src/react/index.tsx'],
    outfile: 'build/react/index.js',
    platform: 'browser',
    external: ['react', 'react-dom', '@gravity-ui/page-constructor'],
    format: 'esm',
    plugins: [inlineScss()],
});

build(nodePlugin)
build(browserPlugin)
build(runtimeBundle)