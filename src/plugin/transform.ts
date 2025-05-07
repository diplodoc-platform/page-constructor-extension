import MarkdownIt from 'markdown-it';
import {load} from 'js-yaml';
import {PageContent} from '@gravity-ui/page-constructor';

import {getPageConstructorContent} from '../renderer/factory';

import {hidden} from './utils';
import {ENV_FLAG_NAME} from './const';
import {pageConstructorDirective} from './directive';
import {preTransformYfmBlocks} from './content-processing/pretransform';
import {modifyPageConstructorLinks} from './content-processing/link-resolver';
import {Runtime} from './types';

export type TransformOptions = {
    runtime?:
        | string
        | {
              script: string;
              style: string;
          };
    bundle?: boolean;
    assetLinkResolver?: (link: string) => string;
    contentLinkResolver?: (link: string) => string;
    onBundle?: (env: {bundled: Set<string>}, output: string, runtime: Runtime) => void;
};

type NormalizedPluginOptions = Omit<TransformOptions, 'runtime'> & {
    runtime: Runtime;
    assetLinkResolver?: (link: string) => string;
    contentLinkResolver?: (link: string) => string;
};

const registerTransforms = (
    md: MarkdownIt,
    {
        runtime,
        bundle,
        output,
        onBundle,
    }: Pick<
        NormalizedPluginOptions,
        'bundle' | 'runtime' | 'assetLinkResolver' | 'contentLinkResolver' | 'onBundle'
    > & {
        output: string;
    },
) => {
    md.use(pageConstructorDirective);

    md.core.ruler.push('yfm_page_constructor', ({env}) => {
        hidden(env, 'bundled', new Set<string>());

        // Check if we've already processed this environment
        if (env?.[ENV_FLAG_NAME] && !env.pageConstructorProcessed) {
            env.meta = env.meta || {};
            env.meta.script = env.meta.script || [];
            env.meta.script.push(runtime.script);
            env.meta.style = env.meta.style || [];
            env.meta.style.push(runtime.style);

            if (bundle && onBundle) {
                onBundle(env, output, runtime);
            }

            // Mark as processed so we don't add scripts multiple times
            env.pageConstructorProcessed = true;
        }
    });
};

type InputOptions = {
    destRoot: string;
};

export function transform(options: Partial<TransformOptions> = {}) {
    const {bundle = true, assetLinkResolver, contentLinkResolver, onBundle} = options;

    if (bundle && typeof options.runtime === 'string') {
        throw new TypeError('Option `runtime` should be record when `bundle` is enabled.');
    }

    const runtime: Runtime =
        typeof options.runtime === 'string'
            ? {script: options.runtime, style: options.runtime}
            : options.runtime || {
                  script: '_assets/page-constructor.js',
                  style: '_assets/page-constructor.css',
              };
    const plugin: MarkdownIt.PluginWithOptions<{output?: string}> = function (
        md: MarkdownIt,
        {output = '.'} = {},
    ) {
        registerTransforms(md, {
            runtime,
            bundle,
            output,
            onBundle,
        });
        md.renderer.rules['yfm_page-constructor'] = (tokens, idx, _options, env, _self) => {
            const token = tokens[idx];
            const yamlContent = load(token.content.trimStart()) as PageContent;

            if (!('blocks' in yamlContent)) {
                throw new Error('Page constructor content must have a "blocks:" property');
            }

            let content = yamlContent;

            if (assetLinkResolver || contentLinkResolver) {
                content = modifyPageConstructorLinks({
                    data: content,
                    getAssetLink: assetLinkResolver || ((link: string) => link),
                    getContentLink: contentLinkResolver || ((link: string) => link),
                });
            }
            console.log(content, 'fff11111');
            const transformedContent = preTransformYfmBlocks(content, env, md) as PageContent;
            console.log(content, 'fff22222');

            return getPageConstructorContent(transformedContent);
        };
    };

    Object.assign(plugin, {
        collect(input: string, {destRoot = '.'}: InputOptions) {
            const md = new MarkdownIt().use((md: MarkdownIt) => {
                registerTransforms(md, {
                    runtime,
                    bundle,
                    output: destRoot,
                    assetLinkResolver,
                    contentLinkResolver,
                    onBundle,
                });
            });

            md.parse(input, {});
        },
    });

    return plugin;
}
