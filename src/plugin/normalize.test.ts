import MarkdownIt from 'markdown-it';
import {describe, expect, it} from 'vitest';

import {normalizePageConstructorContent} from './normalize';

describe('normalizePageConstructorContent', () => {
    it('loads yaml and preprocesses page-constructor structure', () => {
        const md = new MarkdownIt();

        const result = normalizePageConstructorContent(
            `blocks:\n  - type: header-block\n    title: Test title`,
            {md},
        );

        expect(result.blocks).toHaveLength(1);
        expect(result.blocks[0]).toMatchObject({
            type: 'header-block',
            title: '<p>Test title</p>\n',
        });
    });

    it('throws readable error for invalid yaml', () => {
        const md = new MarkdownIt();

        expect(() =>
            normalizePageConstructorContent(`foo: bar`, {
                md,
                path: 'landing.md',
            }),
        ).toThrow('Page constructor content must have a "blocks:" property');
    });
});
