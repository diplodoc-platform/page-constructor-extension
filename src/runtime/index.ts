import type { PageContent } from '@gravity-ui/page-constructor';
import { load } from 'js-yaml';
import { PageConstructor, PageConstructorProvider } from '@gravity-ui/page-constructor';
import { createRoot } from 'react-dom/client';
import React from 'react';

// Declare the global window property for TypeScript
declare global {
    interface Window {
        pageConstructorJsonp: Array<Callback>;
    }
}

// Default configuration for PageConstructor
const DEFAULT_PAGE_CONSTRUCTOR_CONFIG = {
    projectSettings: { disableCompress: true },
    ssrConfig: { isServer: false }
};

// Type definitions
type RunOptions = {
    querySelector?: string;
    nodes?: Element[];
    sanitize?: (content: any) => any;
    config?: any;
};

type RenderContentOptions = {
    content: PageContent;
    element: HTMLElement;
    config?: any;
};

type ExposedAPI = {
    run: (options?: RunOptions) => Promise<void>;
    initialize: (config?: any) => void;
    renderContent: (options: RenderContentOptions) => void;
};

type Callback = (api: ExposedAPI) => void;

// Create a global JSONP-like queue for the page constructor
const jsonp = (window.pageConstructorJsonp = window.pageConstructorJsonp || []);
const queue = jsonp.splice(0, jsonp.length);

// Helper function to decode attributes
const attr = (element: Element, name: string) =>
    decodeURIComponent(element.getAttribute(name) || '');

// Override the push method to handle new callbacks
jsonp.push = function (...args: Callback[]) {
    args.forEach((callback) => {
        queue.push(callback);
        unqueue();
    });

    return queue.length;
};

// Processing lock to ensure one callback is processed at a time
let processing = false;
async function lock(action: () => Promise<void> | void): Promise<void> {
    processing = true;
    await action();
    processing = false;
}

// Process the next callback in the queue
function unqueue() {
    if (!processing && queue.length) {
        call(queue.shift() as Callback);
    }
}

// Identity function for content sanitization
function identity<T>(content: T): T {
    return content;
}

// Process a callback with the exposed API
async function call(callback: Callback): Promise<void> {
    await lock(() =>
        callback({
            run: async ({
                querySelector = '.page-constructor',
                nodes,
                sanitize = identity,
                config = {}
            }: RunOptions = {}) => {
                const nodesList: Element[] = Array.from(
                    nodes || document.querySelectorAll(querySelector),
                );

                for (const element of nodesList) {
                    let content;
                    try {
                        content = load(attr(element, 'data-content'));
                    } catch (e) {
                        console.error('Invalid YAML or JSON content', e);
                        continue;
                    }

                    const sanitizedContent = sanitize(content);
                    const mergedConfig = { ...DEFAULT_PAGE_CONSTRUCTOR_CONFIG, ...config };
                    
                    // Use React to render the content, but without requiring a hook
                    const root = createRoot(element);
                    root.render(
                        React.createElement(
                            React.StrictMode,
                            null,
                            React.createElement(
                                PageConstructorProvider,
                                mergedConfig,
                                React.createElement(PageConstructor, { content: sanitizedContent })
                            )
                        )
                    );
                }
            },
            initialize: (config = {}) => {
                // Merge config with defaults
                Object.assign(DEFAULT_PAGE_CONSTRUCTOR_CONFIG, config);
            },
            renderContent: ({ content, element, config = {} }: RenderContentOptions) => {
                const mergedConfig = { ...DEFAULT_PAGE_CONSTRUCTOR_CONFIG, ...config };
                
                // Use React to render the content, but without requiring a hook
                const root = createRoot(element);
                root.render(
                    React.createElement(
                        React.StrictMode,
                        null,
                        React.createElement(
                            PageConstructorProvider,
                            mergedConfig,
                            React.createElement(PageConstructor, { content })
                        )
                    )
                );
            }
        } as ExposedAPI),
    );

    unqueue();
}

// Start processing the queue
unqueue();