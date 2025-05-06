import * as esbuild from 'esbuild';
import { polyfillNode } from 'esbuild-plugin-polyfill-node';
import { readFileSync } from 'fs';
import {inlineScss} from 'esbuild-inline-sass';
import {sassPlugin} from 'esbuild-sass-plugin';

await esbuild.build({
  entryPoints: ['./browser.jsx'],
  bundle: true,
  outfile: './build/bundle.js',
  platform: 'browser',
  format: 'esm',
  sourcemap: true,
  plugins: [
      polyfillNode({
        polyfills: {
          fs: true,
          path: true,
          process: true,
          buffer: true,
          util: true,
        }
      }),
      sassPlugin(),
    ],
  define: {
      'README_CONTENT': JSON.stringify(readFileSync('../README.md', 'utf-8'))
    },
  alias: {
    '~@gravity-ui/uikit/styles/styles.css': '@gravity-ui/uikit/styles/styles.css',
    '~@diplodoc/transform/dist/css/yfm.css': '@diplodoc/transform/dist/css/yfm.css',
  },
  external: [
        'fs',
        'path',
  ],
});

console.log('✅ Bundle successfully created ./build/bundle.js');
