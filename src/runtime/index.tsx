// @ts-nocheck

import React from 'react';
import { PageContent, PageConstructor, PageConstructorProvider } from '@gravity-ui/page-constructor';
import { hydrateRoot } from 'react-dom/client';

import './index.scss';

export function createPageConstructorElement(content: PageContent, isServer?: boolean) {
    const isServerEnv = isServer !== undefined ? isServer : (typeof window === 'undefined' && typeof global !== 'undefined');

    return (
        <PageConstructorProvider ssrConfig={{ isServer: false }}>
            <PageConstructor content={content} />
        </PageConstructorProvider>
    );
}

export function hydratePageConstructors() {
    if (typeof document === 'undefined') return;

    const containers = document.querySelectorAll('.page-constructor-container');
    
    containers.forEach(container => {
        try {
            if (container.getAttribute('data-hydrated') === 'true') return;
            
            const encodedContent = container.getAttribute('data-content-encoded');
            
            const decodedContent = decodeURIComponent(encodedContent);
            const contentData = JSON.parse(decodedContent);
      
            hydrateRoot(
                container,
                createPageConstructorElement(contentData, false)
            );
            
            container.setAttribute('data-hydrated', 'true');
        } catch (error) {
            console.error('Failed to hydrate component:', error);
        }
    });
}

export function setupPageConstructorObserver() {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    
    const observer = new MutationObserver((mutations) => {
        let needsHydration = false;
        
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList?.contains('page-constructor-container') ||
                            node.querySelector?.('.page-constructor-container')) {
                            needsHydration = true;
                        }
                    }
                });
            }
        });
        
        if (needsHydration) {
            hydratePageConstructors();
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    hydratePageConstructors();
}

if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', hydratePageConstructors);
}
