import { createPageConstructorContent } from '../renderer/browser';
import { setPageConstructorImplementation } from '../renderer/factory';
import { hydratePageConstructors } from '../runtime';

setPageConstructorImplementation(createPageConstructorContent);

export {transform} from './transform';
export { hydratePageConstructors };
