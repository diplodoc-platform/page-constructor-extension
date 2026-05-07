import type MarkdownIt from 'markdown-it';
import type {PageContent} from '@gravity-ui/page-constructor';

import {loadPageContent} from './utils';
import {modifyPageConstructorLinks} from './content-processing/link-resolver';
import {preTransformYfmBlocks} from './content-processing/pretransform';

export interface NormalizePageConstructorOptions {
    path?: string;
    root?: string;
    assetsPublicPath?: string;
    transformLink?: (href: string) => string;
    assetLinkResolver?: (
        link: string,
        path?: string,
        root?: string,
        assetsPublicPath?: string,
    ) => string;
    contentLinkResolver?: (link: string, path?: string, root?: string) => string;
    env?: Record<string, unknown>;
    md: MarkdownIt;
}

export function normalizePageConstructorContent(
    input: string,
    {
        path = '',
        root,
        assetsPublicPath,
        transformLink,
        assetLinkResolver,
        contentLinkResolver,
        env = {},
        md,
    }: NormalizePageConstructorOptions,
): PageContent {
    const loadResult = loadPageContent(input);

    if (loadResult.success === false) {
        const message = loadResult.error + (path ? `\nFile: ${path}` : '');
        throw new Error(message);
    }

    const content = modifyPageConstructorLinks({
        data: loadResult.content,
        getAssetLink: assetLinkResolver,
        getContentLink: contentLinkResolver,
        path,
        root,
        assetsPublicPath,
        transformLink,
    }) as PageContent;

    return preTransformYfmBlocks(content, env, md) as PageContent;
}
