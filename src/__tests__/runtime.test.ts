import type {PageContent} from '@gravity-ui/page-constructor';

import MarkdownIt from 'markdown-it';
import {describe, expect, it} from 'vitest';

describe('React runtime integration', () => {
    it('loads the browser runtime with the installed React packages', async () => {
        await expect(import('../runtime/index')).resolves.toBeDefined();
    }, 60_000);

    it('renders Page Constructor content on the server', async () => {
        const {createPageConstructorContent} = await import('../renderer/server');
        const content = {
            blocks: [
                {
                    type: 'header-block',
                    title: 'React integration smoke test',
                    description: 'Page Constructor renders with the installed React packages.',
                    buttons: [{text: 'UIKit 8 button', url: '#', theme: 'normal-contrast'}],
                },
            ],
        } satisfies PageContent;

        const html = createPageConstructorContent(content, undefined, undefined, 'dark');

        expect(html).toContain('class="yfm-page-constructor"');
        expect(html).toContain('data-hydrated="false"');
        expect(html).toContain('data-theme="dark"');
        expect(html).toContain('React integration smoke test');
        expect(html).toContain('UIKit 8 button');
        expect(html).toContain('g-root_theme_dark');
        expect(html).toContain('g-button_view_contrast-light');
        expect(html).not.toContain('page-constructor-error');
    }, 60_000);

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

    it('renders the page-constructor directive with native Markdown-it 15 and Transform 5', async () => {
        const {default: transformYfm} = await import('@diplodoc/transform');
        const {PAGE_CONSTRUCTOR_RUNTIME, PAGE_CONSTRUCTOR_STYLE, transform} =
            await import('../plugin/index-node');
        const markdown = [
            '::: page-constructor',
            'blocks:',
            '  - type: header-block',
            '    title: Transform 5 Page Constructor',
            '    description: "Render **nested Markdown** here"',
            ':::',
        ].join('\n');
        const plugin = transform({bundle: false});
        const nativeHtml = new MarkdownIt().use(plugin).render(markdown);
        const {result} = transformYfm(markdown, {plugins: [plugin]});

        for (const html of [nativeHtml, result.html]) {
            expect(html).toContain('Transform 5 Page Constructor');
            expect(html).toContain('<strong>nested Markdown</strong>');
        }
        expect(result.meta).toMatchObject({
            script: expect.arrayContaining([PAGE_CONSTRUCTOR_RUNTIME]),
            style: expect.arrayContaining([PAGE_CONSTRUCTOR_STYLE]),
        });
    }, 60_000);
});
