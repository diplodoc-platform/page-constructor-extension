import {hydrateRoot} from 'react-dom/client';
import {createPageConstructorElement} from '../renderer/page-constructor-element'
import {ClassNames} from '../plugin/const';

import './index.scss';

export function hydratePageConstructors() {
    if (typeof document === 'undefined') return;

    const containers = document.querySelectorAll(`.${ClassNames.PageConstructor}`);

    containers.forEach((container) => {
        try {
            if (container.getAttribute('data-hydrated') === 'true') return;

            const encodedContent = container.getAttribute('data-content-encoded');

            if (!encodedContent) return;

            const decodedContent = decodeURIComponent(encodedContent);
            const contentData = JSON.parse(decodedContent);

            hydrateRoot(container, createPageConstructorElement(contentData, false));

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

        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (
                            (node as Element).classList?.contains(ClassNames.PageConstructor) ||
                            (node as Element).querySelector?.(`.${ClassNames.PageConstructor}`)
                        ) {
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
        subtree: true,
    });

    hydratePageConstructors();
}

if (typeof window !== 'undefined') {
    // window.addEventListener('DOMContentLoaded', hydratePageConstructors);
}
