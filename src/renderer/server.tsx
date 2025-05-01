import * as React from 'react';
import {renderToString} from 'react-dom/server';
import {PageContent} from '@gravity-ui/page-constructor';
import {createPageConstructorElement} from '../runtime';

// Устанавливаем глобальный React для серверного рендеринга
(global as any).React = React;

export function createPageConstructorContent(content: PageContent): string {
    try {
        // Для гидратации всегда используем оригинальный контент без HTML-трансформации
        // Это позволяет избежать проблем с гидратацией
        const contentForHydration = content;
        
        // Рендерим компонент в HTML строку
        // isServer=true указывает, что мы на сервере и нужно применить претрансформацию
        const html = renderToString(
            createPageConstructorElement(content, true)
        );
        
        // Кодируем контент для гидратации, чтобы избежать проблем с HTML в JSON
        const encodedContent = encodeURIComponent(JSON.stringify(contentForHydration));
        
        // Оборачиваем HTML в div с данными компонента в data-атрибуте
        // Это будет использовано для гидратации на клиенте
        return `<div class="page-constructor-container" data-content-encoded="${encodedContent}">${html}</div>`;
    } catch (error: any) {
        console.error('Error rendering Page Constructor:', error);
        return `<div class="page-constructor-error">Error rendering component: ${error.message || 'Unknown error'}</div>`;
    }
}
