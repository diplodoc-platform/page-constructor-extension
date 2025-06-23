import {createRoot, hydrateRoot} from 'react-dom/client';
import {createLoadQueue, getScriptStore} from '@diplodoc/utils';

import {createPageConstructorElement} from '../renderer/page-constructor-element';
import {ClassNames, PAGE_CONSTRUCTOR_STORE_SYMBOL, SINGLE_QUEUE_SYMBOL} from '../constants';

export type PageConstructorCallback = () => void | Promise<void>;

class PageConstructorController {
    renderContainer(container: Element): void {
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
            } else if (!isRendered) {
                const root = createRoot(container);
                root.render(createPageConstructorElement(contentData, false));
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

    render(): void {
        const containers = this.getContainers();
        containers.forEach((container) => this.renderContainer(container));
    }
}

if (typeof document !== 'undefined') {
    const store = getScriptStore<PageConstructorController>(PAGE_CONSTRUCTOR_STORE_SYMBOL);

    createLoadQueue({
        store,
        createController: () => {
            const controller = new PageConstructorController();

            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                controller.render();
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    controller.render();
                });
            }

            return controller;
        },
        queueKey: SINGLE_QUEUE_SYMBOL,
    });
}
