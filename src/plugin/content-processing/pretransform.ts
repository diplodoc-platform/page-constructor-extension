import type MarkdownIt from 'markdown-it';
import type {ConfigData, Lang, PreloadParams, TransformerRaw} from './preprocess';

import {preprocess} from './preprocess';

interface MarkdownItEnv {
    lang?: string;
    deps?: unknown[];
    assets?: Set<string>;
    meta?: {
        script?: string[];
        style?: string[];
        [key: string]: unknown;
    };
    pageConstructorProcessed?: boolean;
    bundled?: Set<string>;
    [key: string]: unknown;
}

export function preTransformYfmBlocks(content: ConfigData, env: MarkdownItEnv, md: MarkdownIt) {
    const strings = new Set<string>();
    const extract = (_lang: string, string: string) => {
        strings.add(string);
        return string;
    };

    const options: PreloadParams = {lang: (env.lang || 'en') as Lang};
    preprocess(content, options, extract);
    const keys = [...strings];

    const values: Record<string, string> = {};

    keys.forEach((string) => {
        try {
            const tempEnv = {...env};

            const transformed = md.render(string, tempEnv);

            values[string] = transformed;

            mergeEnvironments(env, tempEnv);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error transforming YFM content:', error);
            values[string] = string;
        }
    });

    const compose: TransformerRaw = (_lang: string, string: string) => values[string] || string;

    return preprocess(content, options, compose);
}

function mergeEnvironments(targetEnv: MarkdownItEnv, sourceEnv: MarkdownItEnv) {
    if (sourceEnv.deps) {
        targetEnv.deps = targetEnv.deps || [];
        targetEnv.deps.push(...sourceEnv.deps);
    }

    if (sourceEnv.assets) {
        targetEnv.assets = targetEnv.assets || new Set();
        sourceEnv.assets.forEach((asset: string) => targetEnv.assets?.add(asset));
    }

    if (sourceEnv.meta) {
        targetEnv.meta = targetEnv.meta || {};
        Object.assign(targetEnv.meta, sourceEnv.meta);
    }
}
