import {useCallback, useEffect, useState} from 'react';
import {ControllerLoadedCallback, getScriptStore} from '@diplodoc/utils';

import {PAGE_CONSTRUCTOR_STORE_SYMBOL, controller} from '../runtime';

export type PageConstructorControllerType = {
    render: () => void;
};

//TODO: use useController from @diplodoc/utils
function useController<T>(storeSymbol: symbol): T | null {
    const [controller, setController] = useState<T | null>(null);

    useEffect(() => {
        const store = getScriptStore<T>(storeSymbol);

        const callback: ControllerLoadedCallback<T> = (ctrl) => {
            setController(ctrl);
        };

        store.push(callback);

        return () => {
            const index = store.indexOf(callback);
            if (index > -1) {
                store.splice(index, 1);
            }
        };
    }, [storeSymbol]);

    return controller;
}

export function usePageConstructorController() {
    return useController<PageConstructorControllerType>(PAGE_CONSTRUCTOR_STORE_SYMBOL);
}

export function usePageConstructor() {
    return useCallback(() => {
        controller.render();
    }, []);
}

export function PageConstructorRuntime() {
    useEffect(() => {
        controller.render();
    }, []);

    return null;
}
