import {PageContent} from '@gravity-ui/page-constructor';

import {ClassNames} from '../common/constants';

export function createPageConstructorContent(content: PageContent): string {
    try {
        const encodedContent = encodeURIComponent(JSON.stringify(content));

        return `<div class="${ClassNames.PageConstructor}" data-content-encoded="${encodedContent}" data-rendered="false"></div>`;
    } catch (error: unknown) {
        return `<div class="page-constructor-error">Error creating placeholder: ${error instanceof Error ? error.message : String(error)}</div>`;
    }
}
