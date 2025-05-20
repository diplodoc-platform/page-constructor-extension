import type MarkdownIt from 'markdown-it';

import {ConfigData, Lang, PreloadParams, TransformerRaw, preprocess} from './preprocess';

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
    // Extract YFM strings from the content
    const strings = new Set<string>();
    const extract = (_lang: string, string: string) => {
        strings.add(string);
        return string;
    };

    // Use preprocess to extract YFM strings
    const options: PreloadParams = {lang: (env.lang || 'en') as Lang};
    preprocess(content, options, extract);

    const keys = [...strings];
    if (!keys.length) {
        return content;
    }

    // Transform the extracted YFM strings
    const values: Record<string, string> = {};

    // Transform each YFM string using markdown-it
    keys.forEach((string) => {
        try {
            // Create a temporary environment for rendering
            const tempEnv = {...env};

            // Render the YFM content using markdown-it
            const transformed = md.render(string, tempEnv);

            // Store the transformed content
            values[string] = transformed;

            // If the transformation generated any dependencies or assets, merge them with the main env
            if (tempEnv.deps) {
                env.deps = env.deps || [];
                env.deps.push(...tempEnv.deps);
            }

            if (tempEnv.assets) {
                env.assets = env.assets || new Set();
                tempEnv.assets.forEach((asset: string) => env.assets?.add(asset));
            }

            // Merge any metadata
            if (tempEnv.meta) {
                env.meta = env.meta || {};
                Object.assign(env.meta, tempEnv.meta);
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error transforming YFM content:', error);
            // Fall back to the original string if transformation fails
            values[string] = string;
        }
    });

    // Apply the transformed content back to the page-constructor blocks
    const compose: TransformerRaw = (_lang: string, string: string) => values[string] || string;

    return preprocess(content, options, compose);
}
