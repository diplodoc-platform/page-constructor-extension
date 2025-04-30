import { createReactComponentContent, hydrateComponents } from '../renderer/browser_roo';
import { setReactComponentImplementation } from '../renderer/factory_roo';

// Устанавливаем клиентскую реализацию
setReactComponentImplementation(createReactComponentContent);

// Экспортируем transform
export {transform} from './transform_roo';
export {registerComponent} from '../runtime/index_roo';

// Экспортируем функцию гидратации для ручной гидратации при необходимости
export { hydrateComponents };

// Экспортируем тестовый компонент
export { TestButton } from '../runtime/index_roo';