import type {PageContent} from '@gravity-ui/page-constructor';
import type {ProjectSettings} from '../types';

export type CreatePageConstructorContentFn = (
    content: PageContent,
    hydrationContent?: PageContent,
    projectSettings?: ProjectSettings,
    theme?: string,
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
    projectSettings?: ProjectSettings,
    theme?: string,
): string {
    if (!currentImplementation) {
        throw new Error(
            'Page constructor implementation not set. Call setPageConstructorImplementation first.',
        );
    }

    return currentImplementation(content, hydrationContent, projectSettings, theme);
}
