import { CompareContent } from './elements.js';
import 'atomico/jsx-runtime';
import '@atomico/hooks/use-debounce-state';
import '@atomico/hooks/use-listener';
import '@atomico/hooks/use-slot';
import 'atomico';

customElements.define("atomico-compare-content", CompareContent);

export { CompareContent };
