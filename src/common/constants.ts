export const PAGE_CONSTRUCTOR_STORE_SYMBOL = Symbol.for('page-constructor-store');
export const SINGLE_QUEUE_SYMBOL = Symbol.for('page-constructor-queue');

export const ENV_FLAG_NAME = 'has-yfm-page-constructor';

export const TokenType = {
    PageConstructor: 'yfm_page-constructor',
} as const;

export const ClassNames = {
    PageConstructor: 'yfm-page-constructor',
} as const;

export type PageConstructorControllerType = {
    render: () => void;
};
