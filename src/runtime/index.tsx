// @ts-nocheck

import React from 'react';
import { PageContent, PageConstructor, PageConstructorProvider } from '@gravity-ui/page-constructor';
import { hydrateRoot } from 'react-dom/client';

import './index.scss';

export function createPageConstructorElement(content: PageContent, isServer?: boolean) {
    // Определяем isServer прямо здесь, если не передан явно
    const isServerEnv = isServer !== undefined ? isServer : (typeof window === 'undefined' && typeof global !== 'undefined');
    
    
    return (
        <PageConstructorProvider ssrConfig={{ isServer: isServerEnv }}>
            <PageConstructor content={content} />
        </PageConstructorProvider>
    );
}

export function hydratePageConstructors() {
    if (typeof document === 'undefined') return;
    // Находим все контейнеры компонентов
    const containers = document.querySelectorAll('.page-constructor-container');
    
    containers.forEach(container => {
        try {
            const encodedContent = container.getAttribute('data-content-encoded');
            
            const decodedContent = decodeURIComponent(encodedContent);
            const contentData = JSON.parse(decodedContent);
      
            hydrateRoot(
                container,
                createPageConstructorElement(contentData, false)
            );
        } catch (error) {
            console.error('Failed to hydrate component:', error);
        }
    });
}

if (typeof window !== 'undefined') {
    window.hydratePageConstructors = hydratePageConstructors;

    window.addEventListener('DOMContentLoaded', hydratePageConstructors);
}

