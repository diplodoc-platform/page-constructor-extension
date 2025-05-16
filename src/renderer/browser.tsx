import {PageContent} from '@gravity-ui/page-constructor';

import {ClassNames} from '../plugin/const';

export function createPageConstructorContent(content: PageContent): string {
    try {
        const encodedContent = encodeURIComponent(JSON.stringify(content));
        
        return `<div class="${ClassNames.PageConstructor}" data-content-encoded="${encodedContent}" data-rendered="false"></div>`;
    } catch (error: any) {
        console.error('Error creating Page Constructor placeholder:', error);
        return `<div class="page-constructor-error">Error creating placeholder: ${error.message || 'Unknown error'}</div>`;
    }
}