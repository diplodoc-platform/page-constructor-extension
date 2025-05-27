import {dirname, join, resolve} from 'node:path';
import {copyFileSync, mkdirSync} from 'node:fs';

import {Runtime, TransformOptions} from '../types';

import {transform as baseTransform} from './transform';
import {defaultTransformLink} from './content-processing/default-link-resolver';

function copy(from: string, to: string) {
    mkdirSync(dirname(to), {recursive: true});
    copyFileSync(from, to);
}

const onBundle = (env: {bundled: Set<string>}, output: string, runtime: Runtime) => {
    const PATH_TO_RUNTIME = '../runtime';
    const runtimeFiles = {
        'index.js': runtime.script,
        'index.css': runtime.style,
    };

    for (const [originFile, outputFile] of Object.entries(runtimeFiles)) {
        if (!outputFile) continue;
        const file = join(PATH_TO_RUNTIME, originFile);
        if (!env.bundled.has(file)) {
            env.bundled.add(file);
            copy(resolve(__dirname, file), join(output, outputFile));
        }
    }
};

export const transform = (options: Partial<TransformOptions> = {}) => {
    const contentLinkResolver =
        options.contentLinkResolver ||
        ((link: string, currentPath?: string) => {
            return defaultTransformLink(link, currentPath);
        });

    return baseTransform({
        ...options,
        onBundle,
        contentLinkResolver,
    });
};
