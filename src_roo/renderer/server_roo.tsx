import * as React from 'react';
import {renderToString} from 'react-dom/server';
import {createReactComponentElement} from '../runtime/index_roo';
import {ClassNames} from '../plugin/const_roo';

// Устанавливаем глобальный React для серверного рендеринга
(global as any).React = React;

export function createReactComponentContent(componentData: any): string {
    try {
        // Рендерим компонент в HTML строку
        const html = renderToString(
            createReactComponentElement(componentData, true)
        );
        
        // Оборачиваем HTML в div с данными компонента в data-атрибуте
        // Это будет использовано для гидратации на клиенте
        return `<div class="${ClassNames.ReactComponentContainer}" data-component-id="${componentData.id || 'default'}" data-component-props='${JSON.stringify(componentData)}'>${html}</div>`;
    } catch (error) {
        console.error('Error rendering React component:', error);
        return `<div class="react-component-error">Error rendering component: ${error.message}</div>`;
    }
}