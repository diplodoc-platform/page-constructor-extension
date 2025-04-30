// Для серверного рендеринга
import * as ReactServer from 'react';

// Функция для получения React (работает и на сервере, и на клиенте)
function getReact() {
    // На сервере используем импортированный React
    if (typeof window === 'undefined') {
        return ReactServer;
    }
    
    // На клиенте используем глобальный React
    return (typeof window !== 'undefined' && (window as any).React) ? (window as any).React : ReactServer;
}

// Реестр компонентов - сопоставляет имена компонентов с их реализациями
const componentRegistry: Record<string, any> = {};

// Регистрация компонента
export function registerComponent(name: string, component: any) {
    componentRegistry[name] = component;
}

// Создание React элемента для компонента
export function createReactComponentElement(data: any, isServer: boolean) {
    const React = getReact();
    const { component, props = {}, children = [] } = data;
    
    // Получаем компонент из реестра
    const Component = componentRegistry[component];
    
    if (!Component) {
        console.warn(`Component "${component}" not found in registry`);
        return React.createElement('div', { 
            className: 'react-component-error',
            'data-component': component
        }, `Component "${component}" not found`);
    }
    
    // Создаем элемент с указанными props
    return React.createElement(
        Component,
        {
            ...props,
            isServer,
            key: props.id || component
        },
        children.map((child: any, index: number) => 
            typeof child === 'object' && child.component
                ? createReactComponentElement(child, isServer)
                : child
        )
    );
}

// Экспортируем пример компонента для тестирования
export const TestButton = (props: any) => {
    const React = getReact();
    const handleClick = () => {
        console.log('Button clicked!', props);
        if (typeof window !== 'undefined') {
            window.alert('Button clicked! Props: ' + JSON.stringify(props));
        }
    };
  
    return React.createElement(
        'button',
        {
            onClick: handleClick,
            style: {
                padding: '10px 20px',
                backgroundColor: props.color || '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                margin: '10px 0'
            }
        },
        props.text || 'Click me'
    );
};

// Более сложный компонент с несколькими событиями
export const Counter = (props: any) => {
    const React = getReact();
    // Используем замыкание для хранения состояния, так как мы не можем использовать useState
    let count = props.initialCount || 0;
    const counterRef = React.createRef();
    
    const updateDisplay = () => {
        if (counterRef.current) {
            // Используем any для обхода проверки типов
            (counterRef.current as any).textContent = String(count);
        }
    };
    
    const increment = () => {
        count += 1;
        updateDisplay();
        console.log('Incremented to', count);
    };
    
    const decrement = () => {
        count -= 1;
        updateDisplay();
        console.log('Decremented to', count);
    };
    
    const reset = () => {
        count = 0;
        updateDisplay();
        console.log('Reset to', count);
    };
    
    // Используем setTimeout для обновления дисплея после рендеринга
    if (typeof window !== 'undefined') {
        setTimeout(updateDisplay, 0);
    }
    
    return React.createElement(
        'div',
        {
            style: {
                border: '1px solid #ccc',
                padding: '15px',
                borderRadius: '5px',
                margin: '10px 0',
                backgroundColor: '#f9f9f9'
            }
        },
        [
            React.createElement('h3', {key: 'title'}, 'Counter Component'),
            React.createElement('p', {key: 'count'}, [
                'Count: ',
                React.createElement('span', {key: 'value', ref: counterRef}, count)
            ]),
            React.createElement('div', {key: 'buttons', style: {display: 'flex', gap: '10px'}}, [
                React.createElement('button', {
                    key: 'inc',
                    onClick: increment,
                    style: {
                        padding: '5px 10px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }
                }, 'Increment'),
                React.createElement('button', {
                    key: 'dec',
                    onClick: decrement,
                    style: {
                        padding: '5px 10px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }
                }, 'Decrement'),
                React.createElement('button', {
                    key: 'reset',
                    onClick: reset,
                    style: {
                        padding: '5px 10px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }
                }, 'Reset')
            ])
        ]
    );
};

// Регистрируем компоненты
registerComponent('TestButton', TestButton);
registerComponent('Counter', Counter);