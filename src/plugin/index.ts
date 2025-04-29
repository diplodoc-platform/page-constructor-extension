import { createPageConstructorContent } from '../renderer/browser';
import { setPageConstructorImplementation } from '../renderer/factory';

// Устанавливаем клиентскую реализацию
setPageConstructorImplementation(createPageConstructorContent);

// Экспортируем transform
export {transform} from './transform';


