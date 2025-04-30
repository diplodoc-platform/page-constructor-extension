import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { PageConstructor, PageConstructorProvider } from '@gravity-ui/page-constructor';
import { load } from 'js-yaml';
import type { PageContent } from '@gravity-ui/page-constructor';

import '../index.scss';

// Default configuration
const DEFAULT_PAGE_CONSTRUCTOR_CONFIG = {
    projectSettings: { disableCompress: true },
    ssrConfig: { isServer: false }
};

/**
 * React hook that finds all elements with the specified selector and renders
 * the PageConstructor component inside them.
 *
 * @param config Configuration for the PageConstructorProvider
 * @param selector CSS selector to find elements to render into
 */
export function usePageConstructor(config = {}, selector = '.page-constructor') {
    if (typeof window === 'undefined') {
        return;
    }

    useEffect(() => {
        const elements = document.querySelectorAll(selector);

        elements.forEach((element) => {
            let content;
            try {
                content = load(decodeURIComponent(element.getAttribute('data-content') || ''));
            } catch (e) {
                console.error('Invalid YAML', e);
                return;
            }

            const root = createRoot(element);
            root.render(
                <React.StrictMode>
                    <PageConstructorProvider {...{...DEFAULT_PAGE_CONSTRUCTOR_CONFIG, ...config}}>
                        <PageConstructor content={content as unknown as PageContent} />
                    </PageConstructorProvider>
                </React.StrictMode>
            );
        });
    }, [selector, config]);
}

// export function usePageConstructor(){
//     console.log('fffff1111')
// }