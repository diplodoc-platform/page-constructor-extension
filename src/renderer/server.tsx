import * as React from 'react';
import {renderToString} from 'react-dom/server';
import {PageContent} from '@gravity-ui/page-constructor';
import {createPageConstructorElement} from '../runtime';

// Устанавливаем глобальный React для серверного рендеринга
(global as any).React = React;

export function createPageConstructorContent(content: PageContent): string {
    try {
        // Рендерим компонент в HTML строку
        const html = renderToString(
            createPageConstructorElement(content, true)
        );
        
        // Оборачиваем HTML в div с данными компонента в data-атрибуте
        // Это будет использовано для гидратации на клиенте
        return `<div class="page-constructor-container" data-content='${JSON.stringify(content)}'>${html}</div>`;
    } catch (error: any) {
        console.error('Error rendering Page Constructor:', error);
        return `<div class="page-constructor-error">Error rendering component: ${error.message || 'Unknown error'}</div>`;
    }
}
