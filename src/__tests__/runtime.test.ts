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

        const html = createPageConstructorContent(content, undefined, undefined, 'dark');

        expect(html).toContain('class="yfm-page-constructor"');
        expect(html).toContain('data-hydrated="false"');
        expect(html).toContain('data-theme="dark"');
        expect(html).toContain('React integration smoke test');
        expect(html).not.toContain('page-constructor-error');
    }, 15_000);

    it('escapes the theme attribute in server-rendered markup', async () => {
        const {createPageConstructorContent} = await import('../renderer/server');
        const html = createPageConstructorContent(
            {blocks: []},
            undefined,
            undefined,
            'dark"&light',
        );

        expect(html).toContain('data-theme="dark&quot;&amp;light"');
    });
});
