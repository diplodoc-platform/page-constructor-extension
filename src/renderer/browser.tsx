import type {PageContent} from '@gravity-ui/page-constructor';

import {ClassNames} from '../constants';

import {renderError} from './error';

export function createPageConstructorContent(
    content: PageContent,
    _hydrationContent?: PageContent,
    _projectSettings?: {disableCompress?: boolean},
): string {
    try {
        const encodedContent = encodeURIComponent(JSON.stringify(content));

        return `<div class="${ClassNames.PageConstructor}" data-content-encoded="${encodedContent}" data-rendered="false"></div>`;
    } catch (error: unknown) {
        return renderError('Error creating placeholder: ', error);
    }
}
