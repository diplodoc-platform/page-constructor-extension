#!/usr/bin/env node
const {build} = require('esbuild');
const {sassPlugin} = require('esbuild-sass-plugin');

const common = {
    bundle: true,
    sourcemap: true,
    tsconfig: './tsconfig.json',
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
    entryPoints: ['src/runtime/index.tsx'],
    platform: 'browser',
    format: 'esm',
    outfile: 'build/runtime/index.js',
    jsx: 'automatic',
    plugins: [sassPlugin()],
    external: [
        // Mark @gravity-ui/page-constructor as external to avoid bundling it
        // '@gravity-ui/page-constructor',
        // 'react',
        // 'react-dom',
    ],
    alias: {
      '~@diplodoc/transform/dist/css/yfm.css': '@diplodoc/transform/dist/css/yfm.css',
  },
    // minify: true,
};

build(nodePlugin)
build(browserPlugin)
build(runtimeBundle)