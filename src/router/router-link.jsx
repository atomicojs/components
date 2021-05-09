import { c } from "atomico";
import { redirect } from "@atomico/hooks/use-router";
import { useChannel } from "@atomico/hooks/use-channel";

function routerLink({ href }) {
  const [path] = useChannel("InheritPath");
  return (
    <host
      onclick={(event) => {
        event.stopPropagation();
        event.preventDefault();
        redirect(path + href);
      }}
    ></host>
  );
}

routerLink.props = {
  href: String,
};

export const RouterLink = c(routerLink, HTMLAnchorElement);
