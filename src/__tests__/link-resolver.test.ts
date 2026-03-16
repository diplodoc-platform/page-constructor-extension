import {join} from 'node:path';
import {describe, expect, it} from 'vitest';

import {modifyPageConstructorLinks} from '../plugin/content-processing/link-resolver';

const CWD = process.cwd();
const FILE_PATH = join(CWD, 'docs/ru/page.md');
const ASSETS_PUBLIC_PATH = 'docs-assets/project/rev/abc123';

describe('modifyPageConstructorLinks', () => {
    describe('assetsPublicPath — image path construction', () => {
        it('does not start with a leading slash (regression: prod 404 bug)', () => {
            const result = modifyPageConstructorLinks({
                data: {image: '_assets/logo.png'},
                path: FILE_PATH,
                assetsPublicPath: ASSETS_PUBLIC_PATH,
            }) as {image: string};

            expect(result.image).not.toMatch(/^\//);
        });

        it('includes assetsPublicPath as prefix', () => {
            const result = modifyPageConstructorLinks({
                data: {image: '_assets/logo.png'},
                path: FILE_PATH,
                assetsPublicPath: ASSETS_PUBLIC_PATH,
            }) as {image: string};

            expect(result.image).toMatch(new RegExp(`^${ASSETS_PUBLIC_PATH}`));
        });

        it('processes all image-like keys (src, icon, logo, desktop, mobile, tablet)', () => {
            const data = {
                src: '_assets/a.png',
                icon: '_assets/b.svg',
                logo: '_assets/c.jpg',
                desktop: '_assets/d.webp',
                mobile: '_assets/e.gif',
                tablet: '_assets/f.bmp',
            };

            const result = modifyPageConstructorLinks({
                data,
                path: FILE_PATH,
                assetsPublicPath: ASSETS_PUBLIC_PATH,
            }) as typeof data;

            for (const key of Object.keys(data) as (keyof typeof data)[]) {
                expect(result[key], `key "${key}"`).not.toMatch(/^\//);
                expect(result[key], `key "${key}"`).toMatch(new RegExp(`^${ASSETS_PUBLIC_PATH}`));
            }
        });

        it('works with array of image strings', () => {
            const result = modifyPageConstructorLinks({
                data: {src: ['_assets/a.png', '_assets/b.png']},
                path: FILE_PATH,
                assetsPublicPath: ASSETS_PUBLIC_PATH,
            }) as {src: string[]};

            expect(result.src).toHaveLength(2);
            for (const src of result.src) {
                expect(src).not.toMatch(/^\//);
                expect(src).toMatch(new RegExp(`^${ASSETS_PUBLIC_PATH}`));
            }
        });
    });

    describe('external URLs — passed through unchanged', () => {
        it('does not modify https:// URLs', () => {
            const url = 'https://example.com/image.png';
            const result = modifyPageConstructorLinks({
                data: {image: url},
                path: FILE_PATH,
                assetsPublicPath: ASSETS_PUBLIC_PATH,
            }) as {image: string};

            expect(result.image).toBe(url);
        });
    });

    describe('custom getAssetLink resolver', () => {
        it('delegates to getAssetLink when provided', () => {
            const custom = (_link: string, _path?: string, _root?: string, pub?: string) =>
                `custom/${pub}/result.png`;

            const result = modifyPageConstructorLinks({
                data: {image: '_assets/logo.png'},
                path: FILE_PATH,
                assetsPublicPath: ASSETS_PUBLIC_PATH,
                getAssetLink: custom,
            }) as {image: string};

            expect(result.image).toBe(`custom/${ASSETS_PUBLIC_PATH}/result.png`);
        });
    });

    describe('without assetsPublicPath — falls back to defaultTransformLink', () => {
        it('returns a non-empty string for local image', () => {
            const result = modifyPageConstructorLinks({
                data: {image: '_assets/logo.png'},
                path: FILE_PATH,
            }) as {image: string};

            expect(typeof result.image).toBe('string');
            expect(result.image.length).toBeGreaterThan(0);
        });
    });
});
