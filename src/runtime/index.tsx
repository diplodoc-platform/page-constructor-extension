// @ts-nocheck

import React from 'react';
import { PageContent, PageConstructor, PageConstructorProvider } from '@gravity-ui/page-constructor';

// @import '@gravity-ui/uikit/styles/styles.css';
import '@gravity-ui/page-constructor/styles/styles.scss';

// Создание элемента PageConstructor
export function createPageConstructorElement(content: PageContent, isServer: boolean) {
    // Если мы на сервере, применяем претрансформацию
    let processedContent = content;
    
    if (isServer) {
        // На сервере применяем претрансформацию YFM блоков
        processedContent = preTransformContent(content);
    }
    
    return (
        <PageConstructorProvider ssrConfig={{ isServer }}>
            <PageConstructor content={processedContent} />
        </PageConstructorProvider>
    );
}

// Функция для претрансформации контента
function preTransformContent(content: PageContent): PageContent {
    // Здесь можно добавить логику претрансформации YFM блоков
    // Например, обработку HTML в текстовых полях
    
    // Для простоты просто возвращаем исходный контент
    return content;
}

// Функция для гидратации компонентов на клиенте
export function hydratePageConstructors() {
    if (typeof document === 'undefined') return;
    // Находим все контейнеры компонентов
    const containers = document.querySelectorAll('.page-constructor-container');
    
    containers.forEach(container => {
        try {
            // Получаем закодированные данные компонента из data-атрибута
            const encodedContent = container.getAttribute('data-content-encoded');
            
            // Если есть закодированные данные, декодируем их
            const decodedContent = decodeURIComponent(encodedContent);
            const contentData = JSON.parse(decodedContent);
      
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
