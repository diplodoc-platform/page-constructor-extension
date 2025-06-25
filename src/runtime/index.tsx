import type {PreMountHook} from '../types';

import {createRoot, hydrateRoot} from 'react-dom/client';
import {createLoadQueue, getScriptStore} from '@diplodoc/utils';

import {createPageConstructorElement} from '../renderer/page-constructor-element';
import {ClassNames, PAGE_CONSTRUCTOR_STORE_SYMBOL, SINGLE_QUEUE_SYMBOL} from '../constants';

class PageConstructorController {
    renderContainer(container: HTMLElement, theme?: string, preMountHook?: PreMountHook): void {
        try {
            const isHydrated = container.getAttribute('data-hydrated') === 'true';
            const isRendered = container.getAttribute('data-rendered') === 'true';

            if (isHydrated || isRendered) return;

            const encodedContent = container.getAttribute('data-content-encoded');
            if (!encodedContent) return;

            const decodedContent = decodeURIComponent(encodedContent);
            const contentData = JSON.parse(decodedContent);
            const element = createPageConstructorElement(
                contentData,
                false,
                undefined,
                theme,
            ) as React.ReactNode;

            if (preMountHook) {
                preMountHook(container);
            }

            if (!isHydrated && container.innerHTML.trim() !== '') {
                hydrateRoot(container, element);
                container.setAttribute('data-hydrated', 'true');
            } else if (!isRendered) {
                const root = createRoot(container);
                root.render(element);
                container.setAttribute('data-rendered', 'true');
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to render component:', error);
        }
    }

    getContainers(): Element[] {
        if (typeof document === 'undefined') return [];

        return Array.from(document.querySelectorAll(`.${ClassNames.PageConstructor}`));
    }

    render(theme?: string, preMountHook?: PreMountHook): void {
        const containers = this.getContainers();
        containers.forEach((container) =>
            this.renderContainer(container as HTMLElement, theme, preMountHook),
        );
    }
}

if (typeof document !== 'undefined') {
    const store = getScriptStore<PageConstructorController>(PAGE_CONSTRUCTOR_STORE_SYMBOL);

    createLoadQueue({
        store,
        createController: () => {
            const controller = new PageConstructorController();

            return controller;
        },
        queueKey: SINGLE_QUEUE_SYMBOL,
    });
}
