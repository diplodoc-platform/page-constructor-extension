import {hydrateRoot, createRoot} from 'react-dom/client';
import {createPageConstructorElement} from '../renderer/page-constructor-element'
import {ClassNames} from '../plugin/const';

import './index.scss';

export function renderPageConstructors() {
    if (typeof document === 'undefined') return;

    const containers = document.querySelectorAll(`.${ClassNames.PageConstructor}`);

    containers.forEach((container) => {
        try {
            const isHydrated = container.getAttribute('data-hydrated') === 'true';
            const isRendered = container.getAttribute('data-rendered') === 'true';
            
            if (isHydrated || isRendered) return;

            const encodedContent = container.getAttribute('data-content-encoded');
            if (!encodedContent) return;

            const decodedContent = decodeURIComponent(encodedContent);
            const contentData = JSON.parse(decodedContent);

            if (!isHydrated && container.innerHTML.trim() !== '') {
                hydrateRoot(container, createPageConstructorElement(contentData, false));
                container.setAttribute('data-hydrated', 'true');
            }
            else if (!isRendered) {
                const root = createRoot(container);
                root.render(createPageConstructorElement(contentData, false));
                container.setAttribute('data-rendered', 'true');
            }
        } catch (error) {
            console.error('Failed to auto-render component:', error);
        }
    });
}

export function setupPageConstructorObserver() {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;

    const observer = new MutationObserver((mutations) => {
        let needsProcessing = false;

        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (
                            (node as Element).classList?.contains(ClassNames.PageConstructor) ||
                            (node as Element).querySelector?.(`.${ClassNames.PageConstructor}`)
                        ) {
                            needsProcessing = true;
                        }
                    }
                });
            }
        });

        if (needsProcessing) {
            renderPageConstructors();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    renderPageConstructors();
}

if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', renderPageConstructors);
}
