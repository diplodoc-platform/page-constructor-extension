import type {PageContent} from '@gravity-ui/page-constructor';

import {describe, expect, it} from 'vitest';

describe('React runtime integration', () => {
    it('loads the browser runtime with the installed React packages', async () => {
        await expect(import('../runtime/index')).resolves.toBeDefined();
    }, 15_000);

    it('renders Page Constructor content on the server', async () => {
        const {createPageConstructorContent} = await import('../renderer/server');
        const content = {
            blocks: [
                {
                    type: 'header-block',
                    title: 'React integration smoke test',
                    description: 'Page Constructor renders with the installed React packages.',
                },
            ],
        } satisfies PageContent;

        const html = createPageConstructorContent(content);

        expect(html).toContain('class="yfm-page-constructor"');
        expect(html).toContain('data-hydrated="false"');
        expect(html).toContain('React integration smoke test');
        expect(html).not.toContain('page-constructor-error');
    }, 15_000);
});
