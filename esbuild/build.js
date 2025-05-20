#!/usr/bin/env node
/* eslint-disable no-console */
const {build: esbuild} = require('esbuild');
const {sassPlugin} = require('esbuild-sass-plugin');
const {polyfillNode} = require('esbuild-plugin-polyfill-node');

const {processBuildMeta} = require('./utils/dev');

const common = {
    bundle: true,
    sourcemap: true,
    minify: process.env.NODE_ENV !== 'development',
    tsconfig: './tsconfig.json',
    metafile: process.env.NODE_ENV === 'development',
    alias: {
        '~@diplodoc/transform/dist/css/yfm.css': '@diplodoc/transform/dist/css/yfm.css',
        '~@gravity-ui/uikit/styles/styles.css': '@gravity-ui/uikit/styles/styles.css',
    },
};

const nodePlugin = {
    ...common,
    entryPoints: ['src/plugin/index-node.ts'],
    platform: 'node',
    outfile: 'build/plugin/index-node.js',
    plugins: [
        {
            name: 'css-mock',
            setup(build) {
                build.onResolve({filter: /\.(css|scss)$/}, (args) => {
                    return {
                        path: args.path,
                        namespace: 'css-mock',
                    };
                });

                build.onLoad({filter: /.*/, namespace: 'css-mock'}, () => {
                    return {
                        contents: 'module.exports = {};',
                        loader: 'js',
                    };
                });
            },
        },
    ],
    external: ['node:*', 'react', 'react-dom', 'markdown-it'],
};

// Build browser plugin
const browserPlugin = {
    ...common,
    entryPoints: ['src/plugin/index.ts'],
    platform: 'neutral',
    format: 'esm',
    outfile: 'build/plugin/index.js',
    plugins: [
        sassPlugin(),
        polyfillNode({
            include: ['util'],
        }),
    ],
    mainFields: ['main', 'module'],
    external: [
        'node:*',
        'react',
        'react-dom',
        '@gravity-ui/page-constructor',
        'undici',
        'markdown-it',
    ],
};

// Build runtime bundle for browser
const runtimeBundle = {
    ...common,
    entryPoints: ['src/runtime/index.tsx'],
    format: 'esm',
    outfile: 'build/runtime/index.js',
    plugins: [sassPlugin()],
};

// Build React components
const reactBundle = {
    ...common,
    entryPoints: ['src/react/index.ts'],
    format: 'esm',
    outfile: 'build/react/index.js',
    plugins: [sassPlugin()],
    external: ['react', 'react-dom', 'react-dom/client', '@gravity-ui/page-constructor'],
};

build(nodePlugin);
build(browserPlugin);
build(runtimeBundle);
build(reactBundle);

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
}
