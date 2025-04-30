import { PageContent } from '@gravity-ui/page-constructor';
import type MarkdownIt from 'markdown-it';
import { load } from 'js-yaml';
import { type Runtime, copyRuntime, dynrequire, hidden } from '../src/plugin/utils';
import { ENV_FLAG_NAME, TokenType } from '../src/plugin/const';
import { pageConstructorDirective } from '../src/plugin/directive';

// Export React hook
export { usePageConstructorRoo } from './react';

// ======== RENDERER FUNCTIONALITY ========

/**
 * Creates a div element with the page constructor content encoded as a data attribute.
 * This div will be rendered by the PageConstructor component on the client side.
 * 
 * @param content The page constructor content
 * @returns HTML string with a div containing the encoded content
 */
export function createPageConstructorContent(content: PageContent): string {
    return `<div class="page-constructor-roo" data-content="${encodeURIComponent(JSON.stringify(content))}"></div>`;
}

// ======== TRANSFORM FUNCTIONALITY ========

export type TransformOptions = {
    runtime?:
        | string
        | {
              script: string;
              style: string;
          };
    bundle?: boolean;
};

type NormalizedPluginOptions = Omit<TransformOptions, 'runtime'> & {
    runtime: Runtime;
};

const registerTransform = (
    md: MarkdownIt,
    {
        runtime,
        bundle,
        output,
    }: Pick<NormalizedPluginOptions, 'bundle' | 'runtime'> & {
        output: string;
    },
) => {
    md.use(pageConstructorDirective);
    
    md.core.ruler.push('yfm_page_constructor_roo_after', ({env}) => {
        hidden(env, 'bundled', new Set<string>());

        if (env?.[ENV_FLAG_NAME]) {
            env.meta = env.meta || {};
            env.meta.script = env.meta.script || [];
            env.meta.script.push(runtime.script);
            env.meta.style = env.meta.style || [];
            env.meta.style.push(runtime.style);

            if (bundle) {
                copyRuntime({runtime, output}, env.bundled);
            }
        }
    });
};

type InputOptions = {
    destRoot: string;
};

export function transform(options: Partial<TransformOptions> = {}) {
    const {bundle = true} = options;

    if (bundle && typeof options.runtime === 'string') {
        throw new TypeError('Option `runtime` should be record when `bundle` is enabled.');
    }

    const runtime: Runtime =
        typeof options.runtime === 'string'
            ? {script: options.runtime, style: options.runtime}
            : options.runtime || {
                  script: '_assets/page-constructor-roo.js',
                  style: '_assets/page-constructor-roo.css',
              };

    const plugin: MarkdownIt.PluginWithOptions<{output?: string}> = function (
        md: MarkdownIt,
        {output = '.'} = {},
    ) {
        registerTransform(md, {
            runtime,
            bundle,
            output,
        });
        md.renderer.rules['yfm_page-constructor'] = (tokens, idx) => {
            const token = tokens[idx];
            const yamlContent = load(token.content.trimStart());
            return createPageConstructorContent({blocks: yamlContent as any});
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
                });
            });

            md.parse(input, {});
        },
    });

    return plugin;
}