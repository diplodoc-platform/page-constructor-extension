#!/usr/bin/env node
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
    external: [
        'react',
        'react-dom',
        // '@gravity-ui/page-constructor',
        // '@diplodoc/transform',
        'markdown-it',
    ],
};

// Build browser plugin
const browserPlugin = {
    ...common,
    entryPoints: ['src/plugin/index.ts'],
    platform: 'neutral',
    // format: 'esm',
    outfile: 'build/plugin/index.js',
    plugins: [
        sassPlugin(),
        polyfillNode({
            include: ['util'], // полифил 'util' для 'object-inspect' //TODO: разорабраться почему тут тянется нодовая зависимость
        }),
    ],
    mainFields: ['main', 'module'],
    external: [
        'node:*',
        // 'react', // TODO: убрать из бандла
        // 'react-dom', // TODO: убрать из бандла
        // '@gravity-ui/page-constructor',
        // '@diplodoc/transform',
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
}
