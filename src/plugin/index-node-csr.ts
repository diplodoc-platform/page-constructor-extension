import {createPageConstructorContent} from '../renderer/browser';
import {setPageConstructorImplementation} from '../renderer/factory';
import {ClassNames, PAGE_CONSTRUCTOR_RUNTIME, PAGE_CONSTRUCTOR_STYLE} from '../constants';

setPageConstructorImplementation(createPageConstructorContent);

export {transform} from './transform-node';
export {loadPageContent, type LoadPageContentResult} from './utils';
export {PAGE_CONSTRUCTOR_RUNTIME, PAGE_CONSTRUCTOR_STYLE, ClassNames};
export type {ConstructorBlock, PageContent} from '../types';
