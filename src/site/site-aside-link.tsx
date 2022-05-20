import { Type, Props, c, css } from "atomico";
import { Source } from "./site";
import { tokens } from "./tokens";

function asideLink({ source }: Props<typeof asideLink>) {
    return (
        <host shadowDom>
            <a class="aside-link-header" href={source.path}>
                <img src={source.icon} alt="Icon" />
                <span>{source.label}</span>
            </a>
            {source.menu && (
                <div class="aside-link-menu">
                    {source.menu.map((source) => (
                        <a
                            target={
                                /(http(s){0,1}:){0,1}\/\//.test(source.src)
                                    ? "_blank"
                                    : ""
                            }
                            href={source.src}
                        >
                            {source.label}
                        </a>
                    ))}
                </div>
            )}
        </host>
    );
}

asideLink.props = {
    source: Object as Type<Source>,
};

asideLink.styles = [
    tokens,
    css`
        :host {
            --icon-size: var(--size-l);
            --gap: var(--size-m);
        }
        .aside-link-header {
            width: 100%;
            height: auto;
            display: grid;
            grid-template-columns: var(--icon-size) 1fr;
            align-items: center;
            grid-gap: var(--gap);
        }
        .aside-link-menu {
            display: grid;
            padding-left: calc(var(--icon-size) + var(--gap));
            box-sizing: border-box;
            font-size: 0.875em;
        }
        .aside-link-menu a {
            padding: 0.25rem 0px;
        }
        a {
            text-decoration: none;
            color: unset;
        }
    `,
];

export const AsideLink = c(asideLink);

customElements.define("site-aside-link", AsideLink);
