import type {PageContent} from '@gravity-ui/page-constructor';

import {load} from 'js-yaml';

export type LoadPageContentResult =
    | {success: true; content: PageContent}
    | {success: false; error: string};
export function loadPageContent(content: string): LoadPageContentResult {
    const yamlContent = load(content.trimStart()) as PageContent;

    if (!('blocks' in yamlContent)) {
        const contentLines = content.trimStart().split('\n');
        const firstLines = contentLines.slice(0, 3).join('\n');

        const message =
            `Page constructor content must have a "blocks:" property\n` +
            `Content preview:\n${firstLines}${contentLines.length > 3 ? '\n...' : ''}`;

        return {success: false, error: message};
    }

    return {success: true, content: yamlContent};
}

export function isLocalUrl(url: string) {
    return !/^(?:[a-z]+:)?\/\//i.test(url);
}

export function hidden<B extends Record<string | symbol, unknown>, F extends string | symbol, V>(
    box: B,
    field: F,
    value: V,
) {
    if (!(field in box)) {
        Object.defineProperty(box, field, {
            enumerable: false,
            value: value,
        });
    }

    return box as B & Record<F, V>;
}
