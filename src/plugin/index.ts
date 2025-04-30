import { createPageConstructorContent } from '../renderer/browser';
import { setPageConstructorImplementation } from '../renderer/factory';
import { hydratePageConstructors } from '../runtime';

// Устанавливаем клиентскую реализацию
setPageConstructorImplementation(createPageConstructorContent);

// Экспортируем transform
export {transform} from './transform';

// Экспортируем функцию гидратации для использования в клиентском коде
export { hydratePageConstructors };

// Создаем глобальный объект для доступа к функциям из скриптов
if (typeof window !== 'undefined') {
    (window as any).ReactComponents = (window as any).ReactComponents || {};
    (window as any).ReactComponents.hydratePageConstructors = hydratePageConstructors;
}
