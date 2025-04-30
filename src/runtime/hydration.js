// Скрипт для экспорта функции гидратации в глобальный объект

// Функция для гидратации компонентов на клиенте
function hydratePageConstructors() {
    if (typeof document === 'undefined') return;
    
    console.log('Hydrating page constructors...');
    
    // Находим все контейнеры компонентов
    const containers = document.querySelectorAll('.page-constructor-container');
    console.log('Found containers:', containers.length);
    
    containers.forEach(container => {
        try {
            // Получаем данные компонента из data-атрибута
            const contentData = JSON.parse(container.getAttribute('data-content') || '{}');
            console.log('Hydrating container with data:', contentData);
            
            // Импортируем ReactDOM динамически
            if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
                // Создаем элемент с помощью React
                const element = React.createElement('div', {
                    className: 'hydrated-component',
                    'data-hydrated': 'true'
                }, 'Component hydrated successfully!');
                
                // Гидратируем компонент
                ReactDOM.hydrateRoot(container, element);
                console.log('Component hydrated successfully');
            } else {
                console.error('React or ReactDOM not found');
            }
        } catch (error) {
            console.error('Failed to hydrate component:', error);
        }
    });
}

// Экспортируем функцию в глобальный объект
if (typeof window !== 'undefined') {
    window.ReactComponents = window.ReactComponents || {};
    window.ReactComponents.hydratePageConstructors = hydratePageConstructors;
    
    // Автоматически запускаем гидратацию при загрузке DOM
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM loaded, running hydration...');
        hydratePageConstructors();
    });
}