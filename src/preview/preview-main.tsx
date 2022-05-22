import { Type, Props, c, css, useHost } from "atomico";
import { IframeResize } from "./preview-iframe";
import { RouterSwitch, RouterCase } from "@atomico/router";
import { useRedirect } from "@atomico/hooks/use-router";
import { Aside } from "./preview-aside";
import { AsideLink } from "./preview-link";
import { tokens } from "./tokens";
import logo from "./logo.svg";

export interface SubSource {
    label: string;
    href?: string;
    path?: string;
    src?: string;
}

export interface Source {
    label: string;
    path: string;
    icon: string;
    src: string;
    menu?: SubSource[];
}

function preview({ sources }: Props<typeof preview>) {
    const host = useHost();
    useRedirect(host);

    return (
        <host shadowDom>
            <div class="view">
                <div class="aside">
                    <Aside>
                        <a href="/" slot="brand">
                            <img src={logo} alt="Logo" width="180" />
                        </a>

                        {sources?.map((source) => (
                            <AsideLink source={source}></AsideLink>
                        ))}
                    </Aside>
                </div>
                <RouterSwitch class="router">
                    {sources?.map((source) => (
                        <RouterCase
                            path={source.path}
                            load={() => <IframeResize src={source.src} />}
                        ></RouterCase>
                    ))}
                    <RouterCase
                        path="/{...example}"
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

preview.props = {
    sources: Array as Type<Source[]>,
};

preview.styles = [
    tokens,
    css`
        :host {
            --aside-link-gap: var(--size-m);
            overflow: hidden;
            display: block;
            height: 100vh;
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
            grid-template: 100vh/ 240px 1fr;
        }
    `,
];

export const Preview = c(preview);

customElements.define("preview-main", Preview);
