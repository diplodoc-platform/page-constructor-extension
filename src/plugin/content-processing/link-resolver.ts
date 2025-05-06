//@ts-nocheck
import {cloneDeepWith, every, isArray, isString} from 'lodash';
import {isLocalUrl} from '@diplodoc/transform/lib/utils';

const FILE_PATTERNS = {
    MEDIA: /^\S.*\.(svg|png|gif|jpg|jpeg|bmp|webp|ico)$/gm,
    CONTENT: /^\S.*\.(md|ya?ml|html)$/gm,
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
    'image',
    'avatar',
    'logo',
    'light',
    'dark',
];

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

function hasFileExtension(link, pattern) {
    return pattern.test(link);
}

function modifyPageConstructorLinks({data, getAssetLink, getContentLink, lang}) {
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

export {modifyPageConstructorLinks};
