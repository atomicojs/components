import { c, css } from "atomico";
import { tokens } from "./tokens";

function aside() {
    return (
        <host shadowDom>
            <div class="header">
                <slot name="brand"></slot>
            </div>
            <div class="menu">
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
            padding: var(--gap) 0 0;
            height: 100%;
            box-sizing: border-box;
            place-content: start;
        }
        .header {
            padding: var(--gap) calc(var(--gap) * 2);
            box-sizing: border-box;
        }
        .menu {
            display: grid;
            min-height: 100%;
            grid-gap: var(--gap);
            padding: 0 calc(var(--gap) * 2);
            box-sizing: border-box;
            overflow: auto;
        }
        ::slotted(*) {
            max-width: 100%;
        }
    `,
];

export const Aside = c(aside);

customElements.define("preview-aside", Aside);
