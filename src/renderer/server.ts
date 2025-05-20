import {renderToString} from 'react-dom/server';
import {PageContent} from '@gravity-ui/page-constructor';

import {ClassNames} from '../plugin/const';

import {createPageConstructorElement} from './page-constructor-element';

export function createPageConstructorContent(content: PageContent): string {
    try {
        const html = renderToString(createPageConstructorElement(content, true));

        const encodedContent = encodeURIComponent(JSON.stringify(content));

        return `<div class="${ClassNames.PageConstructor}" data-content-encoded="${encodedContent}" data-hydrated="false">${html}</div>`;
    } catch (error: unknown) {
        return `<div class="page-constructor-error">Error rendering component: ${error instanceof Error ? error.message : String(error)}</div>`;
    }
}
