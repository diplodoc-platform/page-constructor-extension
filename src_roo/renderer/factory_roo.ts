// Тип для функции createReactComponentContent
export type CreateReactComponentFn = (componentData: any) => string;

// Переменная для хранения текущей реализации
let currentImplementation: CreateReactComponentFn | null = null;

// Функция для установки реализации
export function setReactComponentImplementation(implementation: CreateReactComponentFn): void {
    currentImplementation = implementation;
}

// Функция для получения текущей реализации
export function getReactComponentContent(componentData: any): string {
    if (!currentImplementation) {
        throw new Error('React component implementation not set. Call setReactComponentImplementation first.');
    }
    
    return currentImplementation(componentData);
}