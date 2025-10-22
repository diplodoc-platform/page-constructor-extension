import type {PageContent} from '@gravity-ui/page-constructor';

import {renderToString} from 'react-dom/server';

import {ClassNames} from '../constants';

import {createPageConstructorElement} from './page-constructor-element';
import {renderError} from './error';

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

        return `<div class="${ClassNames.PageConstructor}" data-content-encoded="${encodedContent}" data-hydrated="false">${html}</div>`;
    } catch (error: unknown) {
        return renderError('Error rendering component: ', error);
    }
}
