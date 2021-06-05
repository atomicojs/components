import { c, useEffect } from "atomico";
import { redirect } from "@atomico/hooks/use-router";
import { useChannel } from "@atomico/hooks/use-channel";

function routerRedirect({ path }) {
    const [, setChannel] = useChannel("InheritPath");
    useEffect(() => setChannel(path), [path]);
    return (
        <host
            onclick={
                /**
                 * @param {MouseEvent} ev
                 */
                (ev) => {
                    let { target } = ev;
                    do {
                        if (
                            target.hasAttribute &&
                            target.hasAttribute("href") &&
                            !target.hasAttribute("ignore")
                        ) {
                            ev.preventDefault();
                            const href = target.getAttribute("href");
                            !/^(http(s){0,1}:){0,1}\/\//.test(href) &&
                                redirect((path || "") + href);
                            break;
                        }
                    } while ((target = target.parentNode));
                }
            }
        ></host>
    );
}

routerRedirect.props = {
    path: String,
};

export const RouterRedirect = c(routerRedirect);
