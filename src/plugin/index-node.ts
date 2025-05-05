import { createPageConstructorContent } from '../renderer/server';
import { setPageConstructorImplementation } from '../renderer/factory';

setPageConstructorImplementation(createPageConstructorContent);

export {transform} from './transform';
