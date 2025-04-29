// @ts-nocheck
import type MarkdownIt from 'markdown-it';
import {load} from 'js-yaml';
import {type Runtime, copyRuntime, dynrequire, hidden} from './utils';
import {ENV_FLAG_NAME} from './const';
import {pageConstructorDirective} from './directive';
import {TokenType} from './const';
import { block } from '@gravity-ui/page-constructor';
import { getPageConstructorContent } from '../renderer/factory';

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
    
    md.core.ruler.push('yfm_page_constructor_after', ({env}) => {
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
    }
);
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
        });
        md.renderer.rules['yfm_page-constructor'] = (tokens, idx) => {
            const token = tokens[idx];
            const yamlContent = load(token.content.trimStart());
            const content = getPageConstructorContent({blocks: yamlContent});
            // const content = {blocks: load(token.content.trimStart())} as PageContent;

            return content as string;
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

