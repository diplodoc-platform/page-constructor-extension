import React from 'react';
// Import directly instead of dynamic import
import * as ReactDOM from 'react-dom/client';
import {createReactComponentElement} from '../runtime/index_roo';
import {ClassNames} from '../plugin/const_roo';

// Функция для создания HTML контента (вызывается при серверном рендеринге)
export function createReactComponentContent(componentData: any): string {
    // Эта функция вызывается при серверном рендеринге
    // Возвращает заполнитель, который будет заменен на клиенте
    return `<div class="${ClassNames.ReactComponentContainer}" data-component-id="${componentData.id || 'default'}" data-component-props='${JSON.stringify(componentData)}'></div>`;
}

// Функция для гидратации компонентов на клиенте
export function hydrateComponents() {
    if (typeof document === 'undefined') return;
    
    // Находим все контейнеры компонентов
    const containers = document.querySelectorAll(`.${ClassNames.ReactComponentContainer}`);
    
    containers.forEach(container => {
        try {
            // Получаем данные компонента из data-атрибута
            const componentData = JSON.parse(container.getAttribute('data-component-props') || '{}');
            
            // Гидратируем компонент
            ReactDOM.hydrateRoot(
                container,
                createReactComponentElement(componentData, false)
            );
        } catch (error) {
            console.error('Failed to hydrate component:', error);
        }
    });
}

// Запускаем гидратацию при загрузке DOM
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', hydrateComponents);
}