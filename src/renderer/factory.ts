import {PageContent} from '@gravity-ui/page-constructor';

export type CreatePageConstructorContentFn = (
    content: PageContent,
    hydrationContent?: PageContent,
) => string;

let currentImplementation: CreatePageConstructorContentFn | null = null;

export function setPageConstructorImplementation(
    implementation: CreatePageConstructorContentFn,
): void {
    currentImplementation = implementation;
}

export function getPageConstructorContent(
    content: PageContent,
    hydrationContent?: PageContent,
): string {
    if (!currentImplementation) {
        throw new Error(
            'Page constructor implementation not set. Call setPageConstructorImplementation first.',
        );
    }

    return currentImplementation(content, hydrationContent);
}
