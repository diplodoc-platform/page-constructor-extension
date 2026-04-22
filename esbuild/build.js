#!/usr/bin/env node
/* eslint-disable no-console */
const {build: esbuild} = require('@diplodoc/lint/esbuild');
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
        // Strip @diplodoc/transform — replace with empty module at build time.
        //
        // The dependency chain (runtime → page-constructor components → @diplodoc/transform)
        // pulls in a side-effect script (yfm.js) that registers DOM handlers
        // (cut/details, copy-to-clipboard, term tooltips, wide-mode tables).
        //
        // This script is already loaded by the main Diplodoc app bundle
        // (packages/client/src/components/App/index.tsx imports yfm.js),
        // so bundling it here would duplicate ~43KB of code.
        //
        // We can't use esbuild's `external` option because with format:'esm'
        // it leaves a bare `import "@diplodoc/transform/..."` in the output.
        // The runtime is loaded via <script defer> (not <script type="module">),
        // so the browser throws: SyntaxError: Cannot use import statement outside a module.
        // This caused the runtime to silently fail since commit 5ecf915 (2025-08-20).
        //
        // For standalone usage (outside Diplodoc CLI), consumers should import
        // @diplodoc/transform styles and scripts manually — see README.
        {
            name: 'strip-diplodoc-transform',
            setup(build) {
                build.onResolve({filter: /^@diplodoc\/transform/}, (args) => ({
                    path: args.path,
                    namespace: 'strip-diplodoc-transform',
                }));
                build.onLoad({filter: /.*/, namespace: 'strip-diplodoc-transform'}, () => ({
                    contents: '',
                    loader: 'js',
                }));
            },
        },
    ],
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

const rendererBundle = {
    ...minifyCommon,
    entryPoints: ['src/renderer/index.ts'],
    format: 'esm',
    outfile: 'build/renderer/index.js',
    plugins: [sassPlugin()],
    external: ['react', 'react-dom', '@gravity-ui/page-constructor'],
};

build(nodePlugin);
build(nodeCsrPlugin);
build(browserPlugin);
build(runtimeBundle);
build(reactBundle);
build(styleBundle);
build(rendererBundle);

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
