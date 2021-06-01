import { Modal } from "./modal/modal.jsx";

import {
  RouterRedirect,
  RouterSwitch,
  RouterCase,
  RouterLink,
} from "./router/router.jsx";

import { SendForm } from "./send-form/send-form.jsx";

export { Modal } from "./modal/modal.jsx";

export {
  RouterRedirect,
  RouterSwitch,
  RouterCase,
  RouterLink,
} from "./router/router.jsx";

export { SendForm } from "./send-form/send-form.jsx";

customElements.define("at-modal", Modal);
customElements.define("at-router-redirect", RouterRedirect);
customElements.define("at-router-switch", RouterSwitch);
customElements.define("at-router-case", RouterCase);
customElements.define("at-router-link", RouterLink);
customElements.define("at-send-form", SendForm);
