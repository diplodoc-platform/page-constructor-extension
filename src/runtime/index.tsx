import type {Root} from 'react-dom/client';
import type {PreMountHook} from '../types';

import {useSyncExternalStore} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {createLoadQueue, getScriptStore} from '@diplodoc/utils';

import {createPageConstructorElement} from '../renderer/page-constructor-element';
import {ClassNames, PAGE_CONSTRUCTOR_STORE_SYMBOL, SINGLE_QUEUE_SYMBOL} from '../constants';

import {ThemeStore} from './theme-store';

type PageConstructorContent = Parameters<typeof createPageConstructorElement>[0];

function ThemedPageConstructor({
    content,
    store,
}: {
    content: PageConstructorContent;
    store: ThemeStore;
}) {
    const theme = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

    return createPageConstructorElement(content, false, undefined, theme);
}

interface ContainerState {
    root: Root;
    store: ThemeStore;
}

class PageConstructorController {
    // Roots owned by this controller, keyed by their container. Keeping the root
    // and its theme store lets us re-render in place when the theme changes
    // instead of bailing out and freezing the value captured on first mount.
    private states = new WeakMap<HTMLElement, ContainerState>();

    renderContainer(container: HTMLElement, theme?: string, preMountHook?: PreMountHook): void {
        try {
            const state = this.states.get(container);

            // Already mounted by this controller: push the new theme through the
            // store so the mounted tree re-renders (initial theme and toggles).
            if (state) {
                state.store.setTheme(theme);

                return;
            }

            const isHydrated = container.getAttribute('data-hydrated') === 'true';
            const isRendered = container.getAttribute('data-rendered') === 'true';

            // Mounted by a previous controller instance or another bundle: we do
            // not own that root, so re-rendering is not possible. Preserve the
            // original bail-out to avoid double-mounting the same container.
            if (isHydrated || isRendered) {
                return;
            }

            const encodedContent = container.getAttribute('data-content-encoded');

            if (!encodedContent) {
                return;
            }

            const decodedContent = decodeURIComponent(encodedContent);
            const contentData = JSON.parse(decodedContent);

            if (preMountHook) {
                preMountHook(container);
            }

            // The server markup was produced with the theme baked in at SSR time
            // (`data-theme`). Hydration must match that markup, so the store serves
            // the SSR theme during hydration and the client theme afterwards.
            const ssrTheme = container.getAttribute('data-theme') || undefined;
            const store = new ThemeStore(theme, ssrTheme);
            const element = <ThemedPageConstructor content={contentData} store={store} />;

            let root: Root;

            if (container.innerHTML.trim() === '') {
                root = createRoot(container);
                root.render(element);
                container.setAttribute('data-rendered', 'true');
            } else {
                root = hydrateRoot(container, element);
                container.setAttribute('data-hydrated', 'true');
            }

            this.states.set(container, {root, store});
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to render component:', error);
        }
    }

    getContainers(): Element[] {
        if (typeof document === 'undefined') {
            return [];
        }

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
