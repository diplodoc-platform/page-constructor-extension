import {PageConstructor, PageConstructorProvider, PageContent} from '@gravity-ui/page-constructor';

export function createPageConstructorElement(content: PageContent, isServer?: boolean) {
    const isServerEnv =
        isServer === undefined
            ? typeof window === 'undefined' && typeof global !== 'undefined'
            : isServer;

    return (
        <PageConstructorProvider ssrConfig={{isServer: isServerEnv}}>
            <PageConstructor content={content} />
        </PageConstructorProvider>
    );
}
