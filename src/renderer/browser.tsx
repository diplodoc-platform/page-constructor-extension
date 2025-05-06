import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {PageContent} from '@gravity-ui/page-constructor';

import {ClassNames} from '../plugin/const';
import {createPageConstructorElement} from '../runtime';

export function createPageConstructorContent(content: PageContent): string {
    try {
        const div = document.createElement('div');
        const root = createRoot(div);

        flushSync(() => {
            root.render(createPageConstructorElement(content, false));
        });

        const html = div.innerHTML;

        root.unmount();

        const encodedContent = encodeURIComponent(JSON.stringify(content));

        return `<div class="${ClassNames.PageConstructor}" data-content-encoded="${encodedContent}">${html}</div>`;
    } catch (error: any) {
        console.error('Error rendering Page Constructor in browser:', error);
        return `<div class="page-constructor-error">Error rendering component: ${error.message || 'Unknown error'}</div>`;
    }
}
