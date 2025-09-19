import url from 'url';
import path from 'path';
import {isLocalUrl} from '../utils';

const PAGE_LINK_REGEXP = /\.(md|ya?ml)$/i;

export function defaultTransformLink(link: string, currentPath?: string): string {
    if (!isLocalUrl(link)) {
        return link;
    }

    const parsed = url.parse(link);

    if (!parsed.pathname || parsed.pathname.startsWith('/') || !currentPath) {
        return url.format({
            ...parsed,
            pathname: parsed.pathname?.replace(PAGE_LINK_REGEXP, '.html'),
        });
    }

    const newPathname = parsed.pathname.replace(PAGE_LINK_REGEXP, '.html');

    const cleanPath = newPathname.startsWith('./') ? newPathname.substring(2) : newPathname;

    const currentDir = path.posix.dirname(currentPath);

    const fullPath = path.posix.join(currentDir, cleanPath);

    return url.format({
        ...parsed,
        pathname: fullPath,
    });
}
