import type {PageContent, Theme} from '@gravity-ui/page-constructor';

import {PageConstructor, PageConstructorProvider} from '@gravity-ui/page-constructor';

export function createPageConstructorElement(
    content: PageContent,
    isServer?: boolean,
    projectSettings?: {disableCompress?: boolean},
    theme?: string,
) {
    const isServerEnv =
        isServer === undefined
            ? typeof window === 'undefined' && typeof global !== 'undefined'
            : isServer;
    return (
        <PageConstructorProvider
            ssrConfig={{isServer: isServerEnv}}
            projectSettings={{disableCompress: true, ...projectSettings}}
            theme={theme as Theme}
        >
            <PageConstructor content={content} />
        </PageConstructorProvider>
    );
}
