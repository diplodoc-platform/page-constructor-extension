import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ConstructorBlock, PageConstructor, PageConstructorProvider } from '@gravity-ui/page-constructor';
import { load } from 'js-yaml';

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
export function usePageConstructorRoo(config = {}, selector = '.page-constructor-roo') {
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
                console.error('Invalid YAML or JSON content', e);
                return;
            }

            const root = createRoot(element);
            root.render(
                <React.StrictMode>
                    <PageConstructorProvider {...{...DEFAULT_PAGE_CONSTRUCTOR_CONFIG, ...config}}>
                        <PageConstructor content={{blocks: content as ConstructorBlock[]}} />
                    </PageConstructorProvider>
                </React.StrictMode>
            );
        });
    }, [selector, config]);
}