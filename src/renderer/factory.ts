import { PageContent } from '@gravity-ui/page-constructor';

// Тип для функции createPageConstructorContent
export type CreatePageConstructorContentFn = (content: PageContent, hydrationContent?: PageContent) => string;

// Переменная для хранения текущей реализации
let currentImplementation: CreatePageConstructorContentFn | null = null;

// Функция для установки реализации
export function setPageConstructorImplementation(implementation: CreatePageConstructorContentFn): void {
    currentImplementation = implementation;
}

// Функция для получения текущей реализации
export function getPageConstructorContent(content: PageContent, hydrationContent?: PageContent): string {
    if (!currentImplementation) {
        throw new Error('Page constructor implementation not set. Call setPageConstructorImplementation first.');
    }
    
    return currentImplementation(content, hydrationContent);
}