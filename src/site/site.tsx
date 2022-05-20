import { c, css, useHost } from "atomico";
import { IframeResize } from "../components/iframe-resize/iframe-resize";
import { RouterSwitch, RouterCase } from "@atomico/router";
import { useRedirect } from "@atomico/hooks/use-router";
import { Aside } from "./site-aside";
import { AsideLink } from "./site-aside-link";
import icons from "./icons/icons";
import { tokens } from "./tokens";
import logo from "./logo.svg";

export interface SubSource {
    label: string;
    src: string;
}

export interface Source {
    label: string;
    path: string;
    icon: string;
    src: string;
    menu?: SubSource[];
}

const sources: Source[] = [
    {
        label: "Modal",
        path: "/",
        icon: icons.slide,
        src: "/components/modal/",
        menu: [
            {
                label: "Documentation",
                src: "https://atomico.gitbook.io/doc/atomico/atomico-components/router",
            },
            {
                label: "Example 2",
                src: "/components/modal/example-2",
            },
        ],
    },
    {
        label: "Lottie",
        path: "/lottie",
        icon: icons.lottie,
        src: "/components/lottie/",
    },
    {
        label: "Keen slider",
        path: "/keen-slider",
        icon: icons.modal,
        src: "/components/keen-slider/",
    },
];

function site() {
    const host = useHost();
    useRedirect(host);

    return (
        <host shadowDom>
            <div class="view">
                <div class="aside">
                    <Aside>
                        <img src={logo} alt="Logo" slot="brand" width="180" />

                        {sources.map((source) => (
                            <AsideLink source={source}></AsideLink>
                        ))}
                    </Aside>
                </div>
                <RouterSwitch class="router">
                    {sources.map((source) => (
                        <RouterCase
                            path={source.path}
                            load={() => <IframeResize src={source.src} />}
                        ></RouterCase>
                    ))}
                    <RouterCase
                        path="/components/{...example}"
                        load={(params) => (
                            <IframeResize
                                src={`/components/${params.example}.html`}
                            />
                        )}
                    ></RouterCase>
                </RouterSwitch>
            </div>
        </host>
    );
}

site.styles = [
    tokens,
    css`
        :host {
            --aside-link-gap: var(--size-m);
        }
        .view,
        .router,
        .router-view {
            width: 100%;
            height: 100%;
            max-width: 100%;
        }

        .router {
            display: block;
            position: relative;
        }

        .view {
            display: grid;
            grid-template-columns: 240px 1fr;
        }
        .aside {
        }
        .aside-button {
            display: grid;
            grid-template-columns: 28px auto;
            align-items: center;
            text-decoration: none;
            gap: var(--aside-link-gap);
        }
    `,
];

export const Site = c(site);

customElements.define("atomico-site", Site);
