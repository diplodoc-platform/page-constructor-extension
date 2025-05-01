import * as esbuild from 'esbuild';
import {polyfillNode} from 'esbuild-plugin-polyfill-node';
import {readFileSync} from 'fs';
import {inlineScss} from 'esbuild-inline-sass';
import {sassPlugin} from 'esbuild-sass-plugin';

await esbuild.build({
    entryPoints: ['./node.js'],
    bundle: true,
    outfile: './build/bundle.js',
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
            },
        }),
        // inlineScss(),
        sassPlugin(),
    ],
    define: {
        README_CONTENT: JSON.stringify(readFileSync('../README.md', 'utf-8')),
    },
    alias: {
        '~@diplodoc/transform/dist/css/yfm.css': '@diplodoc/transform/dist/css/yfm.css',
    },

    // external: ['consolidated-events'],
});

console.log('✅ Bundle successfully created ./build/bundle.js');
