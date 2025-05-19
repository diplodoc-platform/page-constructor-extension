import {cloneDeepWith, every, isArray, isString} from 'lodash';
import {isLocalUrl} from '@diplodoc/transform/lib/utils';
import {PageContent} from '@gravity-ui/page-constructor';

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
    function customizer(value: unknown, key?: string | number): StringOrStringArray | undefined {
        if (
            key !== undefined &&
            typeof key === 'string' &&
            keysToFind.includes(key) &&
            (isString(value) || (isArray(value) && every(value, isString)))
        ) {
            return modifyFn(value as StringOrStringArray);
        }
        return undefined;
    }
    return cloneDeepWith(originalObj, customizer);
}

function hasFileExtension(link: string, pattern: RegExp): boolean {
    return pattern.test(link);
}

interface ModifyLinksOptions {
    data: PageContent | unknown;
    getAssetLink?: (link: string) => string;
    getContentLink?: (link: string) => string;
}

function modifyPageConstructorLinks({
    data,
    getAssetLink,
    getContentLink,
}: ModifyLinksOptions): PageContent | unknown {
    return modifyValuesByKeys(
        data,
        LINK_KEYS_PAGE_CONSTRUCTOR_CONFIG,
        (link: StringOrStringArray): StringOrStringArray => {
            const validateLink = (item: string): string => {
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
        },
    );
}

export {modifyPageConstructorLinks};
