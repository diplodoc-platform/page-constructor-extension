import {PageConstructor, PageConstructorProvider, PageContent} from '@gravity-ui/page-constructor';

export function createPageConstructorElement(
    content: PageContent,
    isServer?: boolean,
    projectSettings?: {disableCompress?: boolean},
) {
    const isServerEnv =
        isServer === undefined
            ? typeof window === 'undefined' && typeof global !== 'undefined'
            : isServer;
    return (
        <PageConstructorProvider
            ssrConfig={{isServer: isServerEnv}}
            projectSettings={{disableCompress: true, ...projectSettings}}
        >
            <PageConstructor content={content} />
        </PageConstructorProvider>
    );
}
