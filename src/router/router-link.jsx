import { c } from "atomico";
import { redirect } from "@atomico/hooks/use-router";

function link({ href }) {
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

link.props = {
  href: String,
};

export const Link = c(link, HTMLAnchorElement);
