import {describe, expect, it, vi} from 'vitest';

import {ThemeStore} from '../runtime/theme-store';

describe('ThemeStore', () => {
    it('uses the SSR theme for hydration, then notifies subscribers about client theme changes', () => {
        const store = new ThemeStore('light', 'dark');
        const listener = vi.fn();

        store.subscribe(listener);

        expect(store.getServerSnapshot()).toBe('dark');
        expect(store.getSnapshot()).toBe('light');

        store.setTheme('dark');

        expect(store.getSnapshot()).toBe('dark');
        expect(listener).toHaveBeenCalledOnce();
    });

    it('does not notify after setting the current theme or after unsubscribe', () => {
        const store = new ThemeStore('dark', 'dark');
        const listener = vi.fn();
        const unsubscribe = store.subscribe(listener);

        store.setTheme('dark');
        unsubscribe();
        store.setTheme('light');

        expect(listener).not.toHaveBeenCalled();
    });
});
