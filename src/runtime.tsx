// @ts-nocheck
import React from 'react';
import { PageContent, PageConstructor, PageConstructorProvider } from '@gravity-ui/page-constructor';

// Создание элемента PageConstructor
export function createPageConstructorElement(content: PageContent, isServer: boolean) {
    return (
        <PageConstructorProvider ssrConfig={{ isServer }}>
            <PageConstructor content={content} />
        </PageConstructorProvider>
    );
}

// Функция для гидратации компонентов на клиенте
export function hydratePageConstructors() {
    if (typeof document === 'undefined') return;
    
    // Находим все контейнеры компонентов
    const containers = document.querySelectorAll('.page-constructor-container');
    
    containers.forEach(container => {
        try {
            // Получаем данные компонента из data-атрибута
            const contentData = JSON.parse(container.getAttribute('data-content') || '{}');
            
            // Импортируем ReactDOM динамически, чтобы избежать проблем с серверным рендерингом
            import('react-dom/client').then(({ hydrateRoot }) => {
                // Гидратируем компонент
                hydrateRoot(
                    container,
                    createPageConstructorElement(contentData, false)
                );
            }).catch(error => {
                console.error('Failed to import ReactDOM:', error);
            });
        } catch (error) {
            console.error('Failed to hydrate component:', error);
        }
    });
}

// Запускаем гидратацию при загрузке DOM
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', hydratePageConstructors);
}