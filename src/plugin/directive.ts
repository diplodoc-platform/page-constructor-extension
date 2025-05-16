import type MarkdownIt from 'markdown-it';

import {directiveParser, registerContainerDirective} from '@diplodoc/directive';

import {ClassNames, ENV_FLAG_NAME, TokenType} from './const';

export const pageConstructorDirective: MarkdownIt.PluginSimple = (md) => {
    md.use(directiveParser());

    registerContainerDirective(md, {
        name: 'page-constructor',
        type: 'code_block',
        match(_params, state) {
            state.env ??= {};
            state.env[ENV_FLAG_NAME] = true;

            return true;
        },
        container: {
            tag: 'div',
            token: TokenType.PageConstructor,
            attrs: {
                class: ClassNames.PageConstructor,
            },
        },
    });
};
