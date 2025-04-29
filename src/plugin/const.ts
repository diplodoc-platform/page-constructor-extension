export const ENV_FLAG_NAME = 'has-yfm-page-constructor';

export const TokenType = {
    PageConstructor: 'yfm_page-constructor',
    PageConstructorOpen: 'yfm_page-constructor_open',
    PageConstructorClose: 'yfm_page-constructor_close',
    Title: 'yfm_page-constructor_title',
    TitleOpen: 'yfm_page-constructor_title_open',
    TitleClose: 'yfm_page-constructor_title_close',
    Content: 'yfm_page-constructor_content',
    ContentOpen: 'yfm_page-constructor_content_open',
    ContentClose: 'yfm_page-constructor_content_close',
} as const;

export const ClassNames = {
    PageConstructor: 'yfm-page-constructor',
    Title: 'yfm-page-constructor-title',
    Content: 'yfm-page-constructor-content',
} as const;
