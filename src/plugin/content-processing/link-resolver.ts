import {every, isArray, isString} from 'lodash';
import {join, parse, relative, resolve} from 'path';
import url from 'url';
import {isLocalUrl} from '@diplodoc/transform/lib/utils';
import {resolveRelativePath} from '@diplodoc/transform/lib/utilsFS';
import {PageContent} from '@gravity-ui/page-constructor';

import {defaultTransformLink} from './default-link-resolver';

type StringOrStringArray = string | string[];

const FILE_PATTERNS = {
    MEDIA: /^\S.*\.(svg|png|gif|jpg|jpeg|bmp|webp|ico)$/m,
    CONTENT: /^\S.*\.(md|ya?ml|html)$/m,
};

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
    'avatar',
    'logo',
    'light',
    'dark',
];

function modifyValuesByKeys<T>(
    originalObj: T,
    keysToFind: string[],
    modifyFn: (value: StringOrStringArray) => StringOrStringArray,
): T {
    if (originalObj === null || typeof originalObj !== 'object') {
        return originalObj;
    }

    if (Array.isArray(originalObj)) {
        return originalObj.map((item) =>
            modifyValuesByKeys(item, keysToFind, modifyFn),
        ) as unknown as T;
    }

    const result = {...originalObj} as Record<string, unknown>;

    Object.keys(result).forEach((key) => {
        const value = result[key];

        if (
            keysToFind.includes(key) &&
            (isString(value) || (isArray(value) && every(value, isString)))
        ) {
            result[key] = modifyFn(value as StringOrStringArray);
        } else if (typeof value === 'object' && value !== null) {
            result[key] = modifyValuesByKeys(value, keysToFind, modifyFn);
        }
    });

    return result as unknown as T;
}

function hasFileExtension(link: string, pattern: RegExp): boolean {
    return pattern.test(link);
}

interface ModifyLinksOptions {
    data: PageContent | unknown;
    getAssetLink?: (
        link: string,
        path?: string,
        root?: string,
        assetsPublicPath?: string,
    ) => string;
    getContentLink?: (link: string, path?: string, root?: string) => string;
    path: string;
    root?: string;
    assetsPublicPath?: string;
    transformLink?: (link: string) => string;
}

function modifyPageConstructorLinks({
    data,
    getAssetLink,
    getContentLink,
    path,
    root,
    assetsPublicPath,
    transformLink,
}: ModifyLinksOptions): PageContent | unknown {
    return modifyValuesByKeys(
        data,
        LINK_KEYS_PAGE_CONSTRUCTOR_CONFIG,
        (link: StringOrStringArray): StringOrStringArray => {
            const validateLink = (item: string): string => {
                if (!isLocalUrl(item)) {
                    return item;
                }

                if (hasFileExtension(item, FILE_PATTERNS.MEDIA)) {
                    if (getAssetLink) return getAssetLink(item, path, root, assetsPublicPath);

                    if (assetsPublicPath) {
                        const relativePath = resolveRelativePath(path, item);
                        const relativeToRoot = relative(process.cwd(), relativePath);
                        const publicSrc = join('/', assetsPublicPath, relativeToRoot);

                        return publicSrc;
                    }
                }

                if (hasFileExtension(item, FILE_PATTERNS.CONTENT)) {
                    if (getContentLink) return getContentLink(item, path, root);

                    if (transformLink) {
                        const {pathname} = url.parse(item);
                        const file = resolve(parse(path).dir, pathname || '');
                        const relativePath = relative(process.cwd(), file);

                        return transformLink(relativePath);
                    }
                }

                return defaultTransformLink(item, path);
            };

            return isArray(link) ? link.map(validateLink) : validateLink(link);
        },
    );
}

export {modifyPageConstructorLinks, resolveRelativePath};
