import { RouterCase } from "./elements/router-case.jsx";
import { RouterSwitch } from "./elements/router-switch.jsx";
import { RouterRedirect } from "./elements/router-redirect.jsx";
import { RouterLink } from "./elements/router-link.jsx";

export { redirect, getPath } from "@atomico/hooks/use-router";
export { RouterCase } from "./elements/router-case.jsx";
export { RouterSwitch } from "./elements/router-switch.jsx";
export { RouterRedirect } from "./elements/router-redirect.jsx";
export { RouterLink } from "./elements/router-link.jsx";

customElements.define("a-router-redirect", RouterRedirect);
customElements.define("a-router-switch", RouterSwitch);
customElements.define("a-router-case", RouterCase);
customElements.define("a-router-link", RouterLink, { extends: "a" });
