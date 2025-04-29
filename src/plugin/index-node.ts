import { createPageConstructorContent } from '../renderer/server';
import { setPageConstructorImplementation } from '../renderer/factory';

// Устанавливаем серверную реализацию
setPageConstructorImplementation(createPageConstructorContent);
    console.log('setPageConstructorImplementation');
// Экспортируем transform
export {transform} from './transform';
