import {
    Type,
    Props,
    c,
    css,
    useRef,
    useEffect,
    useHost,
    useState,
} from "atomico";
import { useRouteMatch } from "@atomico/hooks/use-router";
import { useResizeObserverState } from "@atomico/hooks/use-resize-observer";
import { Source } from "./preview-main";
import { tokens } from "./tokens";

function asideLink({ source }: Props<typeof asideLink>) {
    const route = useRouteMatch();
    const host = useHost();
    const refMenu = useRef();
    const [current, setCurrent] = useState<HTMLAnchorElement>();

    const rect = useResizeObserverState(refMenu);

    useEffect(() => {
        const links = [...host.current.shadowRoot.querySelectorAll("a")];
        const current = links.find((link) => link.href === location.href);
        setCurrent(current);
    });

    return (
        <host shadowDom open={!!current}>
            <a id="header" class="header" href={source.path}>
                <img src={source.icon} alt="Icon" />
                <span>{source.label}</span>
            </a>
            {source.menu && (
                <div class="mask">
                    <div class="menu" ref={refMenu}>
                        {source.menu.map((source, id) => (
                            <a
                                id={`menu-${id}`}
                                target={source.href ? "_blank" : ""}
                                href={source.href || source.src}
                            >
                                {source.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}
            <div class="mark">
                <div class="mask_line"></div>
            </div>
            <style>{`
            :host([open]){
                --toggle-height: ${rect?.height || 0}px;
                --current-y: ${current?.offsetTop || 0}px;
                --current-h: ${current?.clientHeight || 0}px;
            }`}</style>
        </host>
    );
}

asideLink.props = {
    open: {
        type: Boolean,
        reflect: true,
    },
    source: Object as Type<Source>,
};

asideLink.styles = [
    tokens,
    css`
        :host {
            --toggle-height: 0px;
            --icon-size: var(--size-l);
            --gap: 20px;
            --transition: 0.5s ease all;
            --mark-opacity: 0;
            --mark-bg: rgba(0, 0, 0, 0.15);
            --mark-cl: rgba(0, 0, 0, 1);
            position: relative;
        }
        :host([open]) {
            --mark-opacity: 1;
        }

        .header {
            width: 100%;
            height: auto;
            display: grid;
            grid-template-columns: var(--icon-size) 1fr;
            align-items: center;
            grid-gap: var(--gap);
        }
        .menu {
            display: grid;
            padding-left: calc(var(--icon-size) + var(--gap));
            box-sizing: border-box;
            font-size: 0.875em;
        }
        .menu a {
            padding: 0.25rem 0px;
        }
        .mask {
            overflow: hidden;
            height: var(--toggle-height);
            transition: var(--transition);
        }
        a {
            text-decoration: none;
            color: unset;
        }
        .mark {
            width: 1px;
            position: absolute;
            height: 100%;
            background: var(--mark-bg);
            top: 0px;
            left: calc(var(--icon-size) + (var(--gap) / 2));
            opacity: var(--mark-opacity);
            transition: var(--transition);
        }
        .mask_line {
            width: 100%;
            background: var(--mark-cl);
            height: var(--current-h);
            transform: translateY(var(--current-y));
            transition: var(--transition);
        }
    `,
];

export const AsideLink = c(asideLink);

customElements.define("preview-link", AsideLink);
