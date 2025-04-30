// @ts-nocheck
import {config, contentTransformer} from '@gravity-ui/page-constructor/server';
import {resolvePageConstructorLinks} from './link-resolver';
import type {PageContent} from '@gravity-ui/page-constructor';

// interface PageConfig {
//     blocks: Array<any>;
//     [key: string]: any;
// }

function isPageConfig(config: PageContent) {
    return 'blocks' in config;
}

function replaceTransformer(config: PageContent, newTransformer: any) {
    return Object.keys(config).reduce((newConfig: PageContent, subBlockType: string) => {
        newConfig[subBlockType] = config[subBlockType].map((block: any) => {
            return block.transformer.name === 'yfmTransformer'
                ? {...block, transformer: newTransformer}
                : block;
        });
        return newConfig;
    }, {});
}

function transformBlocks(blocks: PageContent['blocks'], lang: string, customYfmTransformer: any) {
    const customConfig = replaceTransformer(config, customYfmTransformer);

    return contentTransformer({
        content: {blocks},
        options: {
            lang,
            customConfig,
        },
    }).blocks;
}

interface YfmTransformerOptions {
    lang?: string;
    liquid?: boolean;
    skipError?: boolean;
    sanitizeHtml?: boolean;
}

function yfmTransformer(content: string, options: YfmTransformerOptions, yfmTransform: (content: string, options: any) => { result?: { html: string } }) {
    const {lang = 'en', liquid = true, skipError = false, sanitizeHtml = true} = options;
    
    const resolvedContent = resolvePageConstructorLinks({
        data: content,
        lang,
        filePath: '',
        assetsPublicPath: '/_assets/'
    });
    
    const {result} = yfmTransform(resolvedContent, {lang, liquid, skipError, sanitizeHtml});
    return result?.html || '';
}

export {
    yfmTransformer,
    isPageConfig,
    replaceTransformer,
    transformBlocks
}; 