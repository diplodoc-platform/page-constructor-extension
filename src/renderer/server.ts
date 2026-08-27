import type {PageContent} from '@gravity-ui/page-constructor';

import {renderToString} from 'react-dom/server';

import {ClassNames} from '../constants';

import {createPageConstructorElement} from './page-constructor-element';
import {renderError} from './error';

function escapeHtmlAttribute(value: string): string {
    const entities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
    };

    return value.replace(/[&<>'"]/g, (character) => entities[character]);
}

export function createPageConstructorContent(
    content: PageContent,
    _hydrationContent?: PageContent,
    projectSettings?: {disableCompress?: boolean},
    theme?: string,
): string {
    try {
        const html = renderToString(
            createPageConstructorElement(content, true, projectSettings, theme),
        );

        const encodedContent = encodeURIComponent(JSON.stringify(content));
        const encodedTheme = escapeHtmlAttribute(theme ?? '');

        return `<div class="${ClassNames.PageConstructor}" data-content-encoded="${encodedContent}" data-hydrated="false" data-theme="${encodedTheme}">${html}</div>`;
    } catch (error: unknown) {
        return renderError('Error rendering component: ', error);
    }
}
