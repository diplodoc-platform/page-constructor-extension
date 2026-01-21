import {describe, expect, it} from 'vitest';

import {
    ClassNames,
    PAGE_CONSTRUCTOR_RUNTIME,
    PAGE_CONSTRUCTOR_STYLE,
    TokenType,
} from '../constants';

describe('page-constructor-extension constants', () => {
    it('exports expected runtime asset paths', () => {
        expect(PAGE_CONSTRUCTOR_RUNTIME).toBe('_assets/page-constructor.js');
        expect(PAGE_CONSTRUCTOR_STYLE).toBe('_assets/page-constructor.css');
    });

    it('exports expected token and class names', () => {
        expect(TokenType.PageConstructor).toBe('yfm_page-constructor');
        expect(ClassNames.PageConstructor).toBe('yfm-page-constructor');
    });
});
