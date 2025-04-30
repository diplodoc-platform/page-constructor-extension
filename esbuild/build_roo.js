#!/usr/bin/env node
const {build} = require('esbuild');
const {sassPlugin} = require('esbuild-sass-plugin');

const {
    compilerOptions: {target},
} = require('../tsconfig.json');

const common = {
    bundle: true,
    sourcemap: true,
    target: target,
    tsconfig: './tsconfig.json',
};

// Build node plugin
const nodePlugin = {
    ...common,
    entryPoints: ['src_roo/index.ts'],
    platform: 'node',
    outdir: 'build/plugin_roo',
    plugins: [
      {
        name: 'css-mock',
        setup(build) {
          // Intercept all requests to CSS files
          build.onResolve({ filter: /\.(css|scss)$/ }, args => {
            return {
              path: args.path,
              namespace: 'css-mock',
            };
          });
  
          // Return empty module for CSS
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
  entryPoints: ['src_roo/index.ts'],
  platform: 'browser',
  format: 'esm',
  outdir: 'build/plugin_roo',
  plugins: [sassPlugin()],
  alias: {
      '~@diplodoc/transform/dist/css/yfm.css': '@diplodoc/transform/dist/css/yfm.css',
  },
  external: [
      'node:*',
  ],
};

// Build React component
const reactBundle = {
  ...common,
  entryPoints: ['src_roo/react.tsx'],
  outfile: 'build/react_roo/index.js',
  platform: 'browser',
  jsx: 'automatic',
  plugins: [sassPlugin()],
  external: [
      // Mark external dependencies to avoid bundling them
      '@gravity-ui/page-constructor',
      'react',
      'react-dom',
      'js-yaml'
  ],
  alias: {
    '~@diplodoc/transform/dist/css/yfm.css': '@diplodoc/transform/dist/css/yfm.css',
  },
};

// Execute builds
build(nodePlugin).catch(() => process.exit(1));
build(browserPlugin).catch(() => process.exit(1));
build(reactBundle).catch(() => process.exit(1));

console.log('Build completed for page-constructor-roo');