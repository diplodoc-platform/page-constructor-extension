import * as esbuild from 'esbuild';
import {polyfillNode} from 'esbuild-plugin-polyfill-node';
import {readFileSync} from 'fs';
import {sassPlugin} from 'esbuild-sass-plugin';

await esbuild.build({
    entryPoints: ['./browser/browser.jsx'],
    bundle: true,
    outfile: './browser/build/bundle.js',
    platform: 'browser',
    sourcemap: true,
    plugins: [
        polyfillNode({
            polyfills: {
                fs: true,
                path: true,
                process: true,
                buffer: true,
                util: true,
            },
        }),
        sassPlugin(),
    ],
    define: {
        README_CONTENT: JSON.stringify(readFileSync('./README.md', 'utf-8')),
    },
    alias: {
        '~@gravity-ui/uikit/styles/styles.css': '@gravity-ui/uikit/styles/styles.css',
        '~@diplodoc/transform/dist/css/yfm.css': '@diplodoc/transform/dist/css/yfm.css',
        '@diplodoc/page-constructor-extension': '../build',
        '@diplodoc/page-constructor-extension/runtime/style': '../build/runtime/index.css',
        '@diplodoc/page-constructor-extension/react': '../build/react/index.js',
        '@diplodoc/page-constructor-extension/runtime': '../build/runtime/index.js',
        '@diplodoc/page-constructor-extension/plugin': '../build/plugin/index.js'
    },
});

console.log('✅ Bundle successfully created ./build/bundle.js');
