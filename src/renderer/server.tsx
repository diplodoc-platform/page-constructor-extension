import {renderToString} from 'react-dom/server';
import {PageContent} from '@gravity-ui/page-constructor';
import {createPageConstructorElement} from '../runtime/index';
// import { PageConstructorProvider, PageConstructor } from '@gravity-ui/page-constructor';

export function createPageConstructorContent(content: PageContent): string {
    return renderToString(
        createPageConstructorElement(content, true)
            //  <PageConstructorProvider ssrConfig={{isServer: false   }}>
                    // <PageConstructor content={content} />
                // </PageConstructorProvider>
    );
}
