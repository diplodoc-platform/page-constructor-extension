import type {PageContent} from '@gravity-ui/page-constructor';

import {load} from 'js-yaml';

export type LoadPageContentResult =
    | {success: true; content: PageContent}
    | {success: false; error: string};
export function loadPageContent(content: string): LoadPageContentResult {
    let yamlContent;
    try {
        yamlContent = load(content.trimStart()) as PageContent | undefined;
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.name + ': ' + err.message : String(err),
        };
    }

    if (typeof yamlContent !== 'object' || !Array.isArray(yamlContent.blocks)) {
        return {
            success: false,
            error:
                `Page constructor content must have a "blocks:" property\n` + getContentPreview(),
        };
    }

    if (yamlContent.blocks.some((val) => !val || !val.type)) {
        return {
            success: false,
            error:
                `Page constructor content must contains blocks with a "type: <name>" property\n` +
                getContentPreview(),
        };
    }

    return {success: true, content: yamlContent};

    function getContentPreview() {
        const contentLines = content.trimStart().split('\n');
        const firstLines = contentLines.slice(0, 3).join('\n');

        return `Content preview:\n${firstLines}${contentLines.length > 3 ? '\n...' : ''}`;
    }
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
