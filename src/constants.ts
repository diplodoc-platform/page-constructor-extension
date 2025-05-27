const PAGE_CONSTRUCTOR_STORE_SYMBOL = Symbol.for('page-constructor-store');
const SINGLE_QUEUE_SYMBOL = Symbol.for('page-constructor-queue');

const ENV_FLAG_NAME = 'has-yfm-page-constructor';

const PAGE_CONSTRUCTOR_RUNTIME = '_assets/page-constructor.js';
const PAGE_CONSTRUCTOR_STYLE = '_assets/page-constructor.css';

const TokenType = {
    PageConstructor: 'yfm_page-constructor',
} as const;

const ClassNames = {
    PageConstructor: 'yfm-page-constructor',
} as const;

export {
    PAGE_CONSTRUCTOR_STORE_SYMBOL,
    SINGLE_QUEUE_SYMBOL,
    ENV_FLAG_NAME,
    PAGE_CONSTRUCTOR_RUNTIME,
    PAGE_CONSTRUCTOR_STYLE,
    TokenType,
    ClassNames,
};
