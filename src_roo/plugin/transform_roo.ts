// @ts-nocheck
import type MarkdownIt from 'markdown-it';
import {load} from 'js-yaml';
import {ENV_FLAG_NAME, TokenType} from './const_roo';
import {reactComponentDirective} from './directive_roo';
import {getReactComponentContent} from '../renderer/factory_roo';

export type TransformOptions = {
    runtime?:
        | string
        | {
              script: string;
              style: string;
          };
    bundle?: boolean;
};

export function transform(options: Partial<TransformOptions> = {}) {
    const {bundle = true} = options;
    
    const runtime = typeof options.runtime === 'string'
        ? {script: options.runtime, style: options.runtime}
        : options.runtime || {
              script: '_assets/react-components.js',
              style: '_assets/react-components.css',
          };

    const plugin: MarkdownIt.PluginWithOptions<{output?: string}> = function(
        md: MarkdownIt,
        {output = '.'} = {},
    ) {
        // Регистрируем директиву
        md.use(reactComponentDirective);
        
        // Добавляем ресурсы в страницу
        md.core.ruler.push('react_component_after', ({env}) => {
            if (env?.[ENV_FLAG_NAME]) {
                env.meta = env.meta || {};
                env.meta.script = env.meta.script || [];
                env.meta.script.push(runtime.script);
                env.meta.style = env.meta.style || [];
                env.meta.style.push(runtime.style);
            }
        });
        
        // Рендерим компонент
        md.renderer.rules[TokenType.ReactComponent] = (tokens, idx) => {
            const token = tokens[idx];
            const componentData = load(token.content.trimStart());
            return getReactComponentContent(componentData);
        };
    };

    return plugin;
}