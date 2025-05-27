import {useCallback, useEffect, useState} from 'react';
import {ControllerLoadedCallback, getScriptStore} from '@diplodoc/utils';

import {PAGE_CONSTRUCTOR_STORE_SYMBOL} from '../constants';
import {PageConstructorControllerType} from '../types';

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
    const controller = usePageConstructorController();

    return useCallback(() => {
        controller?.render();
    }, [controller]);
}

export function PageConstructorRuntime() {
    const controller = usePageConstructorController();

    useEffect(() => {
        controller?.render();
    }, [controller]);

    return null;
}
