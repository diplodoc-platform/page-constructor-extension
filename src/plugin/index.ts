import {createPageConstructorContent} from '../renderer/browser';
import {setPageConstructorImplementation} from '../renderer/factory';

setPageConstructorImplementation(createPageConstructorContent);

export {transform} from './transform';
export * from './const';
