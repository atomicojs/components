import { Type, c, css, useRef } from "atomico";
import { useSlot } from "@atomico/hooks/use-slot";
import { Td } from "./td";

function tr() {
    const ref = useRef();
    const slot = useSlot(ref);

    return (
        <host shadowDom td={slot}>
            <div part="background" class="tr-background"></div>
            <slot name="td" ref={ref}></slot>
        </host>
    );
}

tr.props = {
    td: {
        type: Array as Type<InstanceType<typeof Td>[]>,
        event: {
            type: "ChangeTd",
            bubbles: true,
        },
    },
    collapse: {
        type: Boolean,
        reflect: true,
    },
    sticky: {
        type: Boolean,
        reflect: true,
    },
    slot: {
        type: String,
        reflect: true,
        value: "tr",
    },
    last: {
        type: Boolean,
        reflect: true,
    },
};

tr.styles = css`
    :host {
        display: table-row;
        position: relative;
    }
    :host([collapse]) {
        display: grid;
        --border-split: none;
    }
    :host([sticky]:not([collapse])) {
        position: sticky;
        z-index: 1;
        top: 0px;
    }
    :host([slot="header"]) .tr-background {
        background: var(--row-header-background);
        border-radius: var(--row-header-radius);
        box-shadow: var(--row-header-shadow);
    }
    .tr-background {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        background: var(--row-background);
        border-radius: var(--row-radius);
        box-shadow: var(--row-shadow);
        border-bottom: var(--border);
        box-sizing: border-box;
    }
    ::slotted([slot="td"]:last-child) {
        --border-split: none;
    }
`;

export const Tr = c(tr);
