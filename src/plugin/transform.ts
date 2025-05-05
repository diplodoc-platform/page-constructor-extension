// @ts-nocheck
import type MarkdownIt from 'markdown-it';
import {load} from 'js-yaml';
import {type Runtime, copyRuntime, dynrequire, hidden} from './utils';
import {ENV_FLAG_NAME} from './const';
import {pageConstructorDirective} from './directive';
import {TokenType} from './const';
import { block } from '@gravity-ui/page-constructor';
import { getPageConstructorContent } from '../renderer/factory';
import { preTransformYfmBlocks } from './content-processing/pretransform';
import { modifyPageConstructorLinks } from './content-processing/link-resolver';


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
};

type NormalizedPluginOptions = Omit<TransformOptions, 'runtime'> & {
    runtime: Runtime;
    assetLinkResolver?: (link: string) => string;
    contentLinkResolver?: (link: string) => string;
};

const registerTransform = (
    md: MarkdownIt,
    {
        runtime,
        bundle,
        output,
        assetLinkResolver,
        contentLinkResolver,
    }: Pick<NormalizedPluginOptions, 'bundle' | 'runtime' | 'assetLinkResolver' | 'contentLinkResolver'> & {
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

            if (bundle) {
                copyRuntime({runtime, output}, env.bundled);
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
    const {
        bundle = true,
        assetLinkResolver,
        contentLinkResolver
    } = options;

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
        registerTransform(md, {
            runtime,
            bundle,
            output,
            assetLinkResolver,
            contentLinkResolver,
        });
        md.renderer.rules['yfm_page-constructor'] = (tokens, idx, options, env, self) => {
            const token = tokens[idx];
            const yamlContent = load(token.content.trimStart());
            
            let content = 'blocks' in yamlContent ? yamlContent : {blocks: yamlContent};
            
            if (assetLinkResolver || contentLinkResolver) {
                content = modifyPageConstructorLinks({
                    data: content,
                    getAssetLink: assetLinkResolver || ((link) => link),
                    getContentLink: contentLinkResolver || ((link) => link),
                    lang: env.lang || 'en',
                });
            }
            
            const transformedContent = preTransformYfmBlocks(content, env, md);
            
            return getPageConstructorContent(transformedContent);
        };
    };

    Object.assign(plugin, {
        collect(input: string, {destRoot = '.'}: InputOptions) {
            const MdIt = dynrequire('markdown-it');
            const md = new MdIt().use((md: MarkdownIt) => {
                registerTransform(md, {
                    runtime,
                    bundle,
                    output: destRoot,
                    assetLinkResolver,
                    contentLinkResolver,
                });
            });

            md.parse(input, {});
        },
    });

    return plugin;
}



