#!/usr/bin/env node
/* eslint-disable no-console */
const {build: esbuild} = require('esbuild');
const {sassPlugin} = require('esbuild-sass-plugin');
const {polyfillNode} = require('esbuild-plugin-polyfill-node');

const {processBuildMeta} = require('./utils/dev');

/** @type {import('esbuild').BuildOptions} */
const common = {
    bundle: true,
    sourcemap: true,
    minify: false, //when set to true, yfm links inside pc block stop being processed correctly
    tsconfig: './tsconfig.json',
    metafile: process.env.NODE_ENV === 'development',
    alias: {
        '~@diplodoc/transform/dist/css/yfm.css': '@diplodoc/transform/dist/css/yfm.css',
        '~@gravity-ui/uikit/styles/styles.css': '@gravity-ui/uikit/styles/styles.css',
    },
};

/** @type {import('esbuild').BuildOptions} */
const minifyCommon = {
    ...common,
    minifyWhitespace: true,
    minifySyntax: true,
    minifyIdentifiers: true,
    keepNames: true,
};

const nodeExternals = [
    'node:*',
    'react',
    'react-dom',
    'markdown-it',
    '@diplodoc/directive',
    '@diplodoc/utils',
    'js-yaml',
    'lodash',
    '@gravity-ui/page-constructor/server',
];

// Build node plugin with server side rendering
/** @type {import('esbuild').BuildOptions} */
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
    external: nodeExternals,
};

// Build node plugin with client side rendering
/** @type {import('esbuild').BuildOptions} */
const nodeCsrPlugin = {
    ...common,
    entryPoints: ['src/plugin/index-node-csr.ts'],
    platform: 'node',
    outfile: 'build/plugin/index-node-csr.js',
    external: nodeExternals,
};

// Build browser plugin
const browserPlugin = {
    ...minifyCommon,
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
    ...minifyCommon,
    format: 'esm',
    entryPoints: ['src/runtime/index.tsx'],
    outfile: 'build/runtime/index.js',
    plugins: [
        sassPlugin(),
        polyfillNode({
            include: ['util'],
        }),
    ],
    external: ['@diplodoc/transform'],
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

const styleBundle = {
    minify: true,
    entryPoints: ['src/styles/index.scss'],
    outfile: 'build/index.css',
    plugins: [sassPlugin()],
};

build(nodePlugin);
build(nodeCsrPlugin);
build(browserPlugin);
build(runtimeBundle);
build(reactBundle);
build(styleBundle);

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
