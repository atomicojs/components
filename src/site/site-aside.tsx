import { c, css } from "atomico";
import { tokens } from "./tokens";

function aside() {
    return (
        <host shadowDom>
            <div class="aside-header">
                <slot name="brand"></slot>
            </div>
            <div class="aside-menu">
                <slot></slot>
            </div>
        </host>
    );
}

aside.styles = [
    tokens,
    css`
        :host {
            display: grid;
            --gap: var(--size-m);
            grid-gap: var(--gap);
            padding: var(--gap) 0;
        }
        .aside-header {
            padding: var(--gap) calc(var(--gap) * 2);
            box-sizing: border-box;
        }
        .aside-menu {
            display: grid;
            grid-gap: var(--gap);
            padding: 0 calc(var(--gap) * 2);
            box-sizing: border-box;
        }
        ::slotted(*) {
            max-width: 100%;
        }
    `,
];

export const Aside = c(aside);

customElements.define("site-aside", Aside);
