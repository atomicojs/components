import { Props, c, css, useEffect, useRef, useUpdate } from "atomico";
import { useSlot } from "@atomico/hooks/use-slot";
import { useMediaQuery } from "@atomico/hooks/use-media-query";
export { Td } from "./slots/td";
export { Tr } from "./slots/tr";
import { Tr } from "./slots/tr";
import { tokens } from "./tokens";

let breakpointDefault = "(max-width: 0px)";

function table({ collapse, breakpoint }: Props<typeof table>) {
    const refHeader = useRef();
    const slotHeader = useSlot<InstanceType<typeof Tr>>(refHeader);
    const refBody = useRef();
    const slotBody = useSlot<InstanceType<typeof Tr>>(refBody);
    const update = useUpdate();
    const isCollapse = useMediaQuery(breakpoint || breakpointDefault);

    collapse = breakpointDefault === breakpoint ? collapse : isCollapse;

    useEffect(() => {
        const [firstHeader] = slotHeader.map((tr) =>
            tr.td?.map(({ label, textContent }) => label || textContent)
        );

        if (!firstHeader?.length) return;

        slotBody.forEach((tr, i) => {
            tr.collapse = collapse;
            tr.last = slotBody.length === i + 1;
            tr.td?.forEach((td, index) => (td.column = firstHeader[index]));
        });
    });

    return (
        <host shadowDom collapse={collapse}>
            <slot name="header" ref={refHeader} onChangeTd={update}></slot>
            <slot name="tr" ref={refBody}></slot>
        </host>
    );
}

table.props = {
    collapse: { type: Boolean, reflect: true },
    breakpoint: { type: String, value: breakpointDefault },
};

table.styles = [
    tokens,
    css`
        :host {
            width: 100%;
            --td-header: none;
            border: var(--border);
            border-radius: var(--radius);
            box-sizing: border-box;
            background: var(--background);
        }
        :host(:not([collapse])) {
            display: table;
            border-collapse: separate;
            border-spacing: 0 var(--row-gap);
        }
        :host([collapse]) {
            display: grid;
            gap: var(--row-gap);
            --td-header: flex;
        }
        :host([collapse]) slot[name="header"] {
            display: none;
        }
        ::slotted([last]) {
            --border: none;
            --row-radius: var(--row-last-radius);
        }
    `,
];

export const Table = c(table);
