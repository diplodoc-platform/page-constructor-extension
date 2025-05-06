import {renderToString} from 'react-dom/server';
import {PageContent} from '@gravity-ui/page-constructor';

import {ClassNames} from '../plugin/const';
import {createPageConstructorElement} from '../runtime';

export function createPageConstructorContent(content: PageContent): string {
    try {
        const html = renderToString(createPageConstructorElement(content, true));

        const encodedContent = encodeURIComponent(JSON.stringify(content));

        return `<div class="${ClassNames.PageConstructor}" data-content-encoded="${encodedContent}">${html}</div>`;
    } catch (error: any) {
        console.error('Error rendering Page Constructor:', error);
        return `<div class="page-constructor-error">Error rendering component: ${error.message || 'Unknown error'}</div>`;
    }
}
