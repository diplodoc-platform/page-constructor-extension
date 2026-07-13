import {formatHref, parseHref} from '@diplodoc/utils';
import path from 'path';

import {isLocalUrl} from '../utils';

const PAGE_LINK_REGEXP = /\.(md|ya?ml)$/i;

export function defaultTransformLink(link: string, currentPath?: string): string {
    if (!isLocalUrl(link)) {
        return link;
    }

    const parsed = parseHref(link);

    if (!parsed.pathname || parsed.pathname.startsWith('/') || !currentPath) {
        return formatHref({
            ...parsed,
            pathname: parsed.pathname?.replace(PAGE_LINK_REGEXP, '.html'),
        });
    }

    const newPathname = parsed.pathname.replace(PAGE_LINK_REGEXP, '.html');

    const cleanPath = newPathname.startsWith('./') ? newPathname.substring(2) : newPathname;

    const currentDir = path.posix.dirname(currentPath);

    const fullPath = path.posix.join(currentDir, cleanPath);

    return formatHref({
        ...parsed,
        pathname: fullPath,
    });
}
