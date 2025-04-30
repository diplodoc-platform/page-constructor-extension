import * as React from 'react';
import { createPageConstructorContent } from '../renderer/server';
import { setPageConstructorImplementation } from '../renderer/factory';

// Устанавливаем глобальный React для серверного рендеринга
(global as any).React = React;

// Устанавливаем серверную реализацию
setPageConstructorImplementation(createPageConstructorContent);
console.log('Page Constructor Plugin: Server implementation set');

// Экспортируем transform
export {transform} from './transform';
