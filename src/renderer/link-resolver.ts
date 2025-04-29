//@ts-nocheck
// import {config, contentTransformer} from '@gravity-ui/page-constructor/server';
import * as cheerio from 'cheerio';
import {cloneDeepWith, isArray, isString, every} from 'lodash';
import {isLocalUrl} from '@diplodoc/transform/lib/utils';

// const CWD = process.cwd() + '/';
const CWD = '/';

function resolveRelativePath(fromPath, relativePath) {
    const {dir: fromDir} = parse(fromPath);

    const result = resolve(fromDir, relativePath);

    if (!result.startsWith(CWD)) {
        return relativePath;
    }

    return result.replace(CWD, '');
}

function canonicalLink(link) {
    return (
        pathNormalize(link)
            .replace(/^\.\/$/, '/')
            .replace(/^\/+/, '') || '/'
    );
}

function isPageConfig(config) {
    return 'blocks' in config;
}

function preprocess(content, params = {}, customYfmTransformer) {
    const {lang = 'en'} = params;

    if (isPageConfig(content) && content.blocks) {
        return {
            ...content,
            blocks: transformBlocks(content.blocks, lang, customYfmTransformer),
        };
    }

    return content;
}

function replaceTransformer(config, newTransformer) {
    return Object.keys(config).reduce((newConfig, subBlockType) => {
        newConfig[subBlockType] = config[subBlockType].map((block) => {
            return block.transformer.name === 'yfmTransformer'
                ? {...block, transformer: newTransformer}
                : block;
        });
        return newConfig;
    }, {});
}

function transformBlocks(blocks, lang, customYfmTransformer) {
    const customConfig = replaceTransformer(config, customYfmTransformer);

    return contentTransformer({
        content: {blocks},
        options: {
            lang,
            customConfig,
        },
    }).blocks;
}

const FILE_PATTERNS = {
    MEDIA: /^\S.*\.(svg|png|gif|jpg|jpeg|bmp|webp|ico)$/gm,
    CONTENT: /^\S.*\.(md|ya?ml|html)$/gm,
};

const LINK_PATTERNS = {
    EXTERNAL: /^https?:\/\//,
    LANG_PREFIX: (lang) => new RegExp(`^${lang}/|^/${lang}`),
};

function hasFileExtension(link, pattern) {
    return pattern.test(link);
}

function isExternalHref(href) {
    return href.startsWith('http') || href.startsWith('//');
}

function checkLinksNeedsNormalization(url, langSegment) {
    return !LINK_PATTERNS.LANG_PREFIX(langSegment).test(url) && !LINK_PATTERNS.EXTERNAL.test(url);
}

function normalizeRelativeLinksToBase({item, lang, filePath}) {
    if (!item || isExternalHref(item)) {
        return item;
    }

    const relativePath = resolveRelativePath(filePath, item);
    return relativePath.includes('../') ? item : canonicalLink(lang + '/' + relativePath);
}

function modifyLeadingPageLinks({data, lang, filePath}) {
    return modifyValuesByKeys(data, LINK_KEYS_LEADING_CONFIG, (item) =>
        normalizeRelativeLinksToBase({item, lang, filePath}),
    );
}

function modifyTitleLinks(data, getContentLink) {
    return modifyValuesByKeys(data, 'title', (html) => {
        const hasLink = /<a\s+href=["']([^"']*)["']/is.test(html);
        if (!hasLink) {
            return html;
        }
        const $ = cheerio.load(html);
        const href = $('a')?.attr('href');
        if (href && checkLinksNeedsNormalization(href)) {
            const newLink = getContentLink(href);
            $('a').attr('href', newLink);
            return $.html();
        }
        return html;
    });
}

function modifyValuesByKeys(originalObj, keysToFind, modifyFn) {
    function customizer(value, key) {
        if (
            keysToFind.includes(key) &&
            (isString(value) || (isArray(value) && every(value, isString)))
        ) {
            return modifyFn(value);
        }
    }
    return cloneDeepWith(originalObj, customizer);
}

function getAssetApiPath({currentPath, src, prefix}) {
    const path = resolveRelativePath(currentPath, src);
    const publicSrc = prefix + '/' + path;
    return path.includes('..') ? src : publicSrc;
}

function modifyPageConstructorLinks({
    data,
    getAssetLink,
    getContentLink,
    lang,
}) {
    return modifyValuesByKeys(data, LINK_KEYS_PAGE_CONSTRUCTOR_CONFIG, (link) => {
        const validateLink = (item) => {
            if (!isLocalUrl(item)) {
                return item;
            }

            if (getAssetLink && hasFileExtension(item, FILE_PATTERNS.MEDIA)) {
                return getAssetLink(item);
            }

            if (getContentLink && hasFileExtension(item, FILE_PATTERNS.CONTENT)) {
                return getContentLink(item);
            }

            return item;
        };

        return isArray(link) ? link.map(validateLink) : validateLink(link);
    });
}

function resolvePageConstructorLinks({
    data,
    lang,
    filePath,
    assetsPublicPath,
}) {
    return modifyPageConstructorLinks({
        data,
        getAssetLink: (link) =>
            getAssetApiPath({
                currentPath: lang + '/' + filePath,
                src: link,
                prefix: assetsPublicPath,
            }),
        getContentLink: (link) =>
            normalizeRelativeLinksToBase({item: link, lang, filePath}),
        lang,
    });
}

function preparePageConstructorContent({content, options}) {
    const {lang, filePath, assetsPublicPath, yfmTransformer} = options;

    // Step 1: Convert YFM to HTML
    const processedContent = preprocess(content, {lang}, yfmTransformer);

    // Step 2: Resolve all links
    const contentWithResolvedLinks = resolvePageConstructorLinks({
        data: processedContent,
        lang,
        filePath,
        assetsPublicPath,
    });

    return contentWithResolvedLinks;
}

const LINK_KEYS_LEADING_CONFIG = ['href'];
const LINK_KEYS_PAGE_CONSTRUCTOR_CONFIG = [
    'src',
    'url',
    'href',
    'icon',
    'image',
    'desktop',
    'mobile',
    'tablet',
    'previewImg',
    'image',
    'avatar',
    'logo',
    'light',
    'dark',
];

const LINK_KEYS = [...new Set([...LINK_KEYS_LEADING_CONFIG, ...LINK_KEYS_PAGE_CONSTRUCTOR_CONFIG])];

export {
    preprocess,
    isPageConfig,
    replaceTransformer,
    transformBlocks,
    isExternalHref,
    normalizeRelativeLinksToBase,
    modifyLeadingPageLinks,
    checkLinksNeedsNormalization,
    modifyTitleLinks,
    modifyPageConstructorLinks,
    resolvePageConstructorLinks,
    preparePageConstructorContent,
    modifyValuesByKeys,
    getAssetApiPath,
    LINK_KEYS_LEADING_CONFIG,
    LINK_KEYS_PAGE_CONSTRUCTOR_CONFIG,
    LINK_KEYS
};