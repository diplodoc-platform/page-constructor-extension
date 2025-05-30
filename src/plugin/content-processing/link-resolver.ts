import {every, isArray, isString} from 'lodash';
import {isLocalUrl} from '@diplodoc/transform/lib/utils';
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
    getAssetLink?: (link: string) => string;
    getContentLink?: (link: string, currentPath?: string) => string;
    currentPath?: string;
}

function modifyPageConstructorLinks({
    data,
    getAssetLink,
    getContentLink,
    currentPath,
}: ModifyLinksOptions): PageContent | unknown {
    const useDefaultTransform = !getAssetLink && !getContentLink;

    return modifyValuesByKeys(
        data,
        LINK_KEYS_PAGE_CONSTRUCTOR_CONFIG,
        (link: StringOrStringArray): StringOrStringArray => {
            const validateLink = (item: string): string => {
                if (!isLocalUrl(item)) {
                    return item;
                }

                if (!useDefaultTransform) {
                    if (getAssetLink && hasFileExtension(item, FILE_PATTERNS.MEDIA)) {
                        return getAssetLink(item);
                    }

                    if (getContentLink && hasFileExtension(item, FILE_PATTERNS.CONTENT)) {
                        return getContentLink(item, currentPath);
                    }

                    return item;
                }

                return defaultTransformLink(item, currentPath);
            };

            return isArray(link) ? link.map(validateLink) : validateLink(link);
        },
    );
}

export {modifyPageConstructorLinks};
