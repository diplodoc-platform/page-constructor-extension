import { PageConstructorProvider, PageConstructor, PageContent } from '@gravity-ui/page-constructor';

// Import styles
import './index.scss';

export function createPageConstructorElement(content: PageContent, isServer: boolean = false) {
    console.log('createPageConstructorElement - server')

    return (
        <PageConstructorProvider ssrConfig={{isServer}}>
            <PageConstructor content={content} />
        </PageConstructorProvider>
    );
}
