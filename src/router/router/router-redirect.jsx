import { c } from "atomico";
import { redirect } from "@atomico/hooks/use-router";

function routerRedirect() {
  return (
    <host
      onclick={
        /**
         * @param {MouseEvent} ev
         */
        (ev) => {
          let { target } = ev;
          do {
            if (target.hasAttribute && target.hasAttribute("href")) {
              ev.preventDefault();
              redirect(target.getAttribute("href"));
              break;
            }
          } while ((target = target.parentNode));
        }
      }
    ></host>
  );
}

routerRedirect.props = {
  base: { type: String, value: "/" },
};

export const RouterRedirect = c(routerRedirect);
