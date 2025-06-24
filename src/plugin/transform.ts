import MarkdownIt from 'markdown-it';
import {load} from 'js-yaml';
import {PageContent} from '@gravity-ui/page-constructor';

import {getPageConstructorContent} from '../renderer/factory';
import {ENV_FLAG_NAME, PAGE_CONSTRUCTOR_RUNTIME, PAGE_CONSTRUCTOR_STYLE} from '../constants';
import {Runtime, TransformOptions} from '../types';

import {hidden} from './utils';
import {pageConstructorDirective} from './directive';
import {preTransformYfmBlocks} from './content-processing/pretransform';
import {modifyPageConstructorLinks} from './content-processing/link-resolver';

type NormalizedPluginOptions = Omit<TransformOptions, 'runtime'> & {
    runtime: Runtime;
    assetLinkResolver?: (link: string, path?: string, root?: string) => string;
    contentLinkResolver?: (link: string, path?: string, root?: string) => string;
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
                  script: PAGE_CONSTRUCTOR_RUNTIME,
                  style: PAGE_CONSTRUCTOR_STYLE,
              };
    const plugin: MarkdownIt.PluginWithOptions<{
        output?: string;
        path?: string;
        root?: string;
        transformLink?: (href: string) => string;
        assetsPublicPath?: string;
    }> = function (md: MarkdownIt, pluginOptions = {}) {
        const {output = '.', path = '', root, assetsPublicPath, transformLink} = pluginOptions;

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
                const contentLines = token.content.trimStart().split('\n');
                const firstLines = contentLines.slice(0, 3).join('\n');

                throw new Error(
                    `Page constructor content must have a "blocks:" property\n` +
                        `Content preview:\n${firstLines}${contentLines.length > 3 ? '\n...' : ''}` +
                        (path ? `\nFile: ${path}` : ''),
                );
            }

            const content = modifyPageConstructorLinks({
                data: yamlContent,
                getAssetLink: assetLinkResolver,
                getContentLink: contentLinkResolver,
                path,
                root,
                assetsPublicPath,
                transformLink,
            }) as PageContent;

            const transformedContent = preTransformYfmBlocks(content, env, md) as PageContent;

            return getPageConstructorContent(
                transformedContent,
                undefined,
                options.projectSettings,
            );
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
