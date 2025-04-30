//@ts-nocheck
import type MarkdownIt from 'markdown-it';

import {directiveParser, registerContainerDirective} from '@diplodoc/directive';

import {ClassNames, ENV_FLAG_NAME, TokenType} from './const_roo';

export const reactComponentDirective: MarkdownIt.PluginSimple = (md) => {
    md.use(directiveParser());

    registerContainerDirective(md, {
        name: 'react-component',
        type: 'code_block',
        match(_params, state) {
            state.env ??= {};
            state.env[ENV_FLAG_NAME] = true;

            return true;
        },
        container: {
            tag: 'div',
            token: TokenType.ReactComponent,
            attrs: {
                class: ClassNames.ReactComponent,
            },
        },
    });
};