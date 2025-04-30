import { createReactComponentContent } from '../renderer/server_roo';
import { setReactComponentImplementation } from '../renderer/factory_roo';

// Устанавливаем серверную реализацию
setReactComponentImplementation(createReactComponentContent);
console.log('React Component Plugin: Server implementation set');

// Экспортируем transform
export {transform} from './transform_roo';