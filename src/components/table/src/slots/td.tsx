import { Props, c, css } from "atomico";
import { useRender } from "@atomico/hooks/use-render";
import { tokens } from "../tokens";

function td({ column, width }: Props<typeof td>) {
    useRender(() => <div slot="header">{column}</div>, [column]);
    return (
        <host shadowDom>
            <div class="header">
                <slot name="header"></slot>
            </div>
            <div class="content">
                <slot></slot>
            </div>
            {width && <style>{`:host{--cell-width:${width}}`}</style>}
        </host>
    );
}

td.props = {
    slot: { type: String, reflect: true, value: "td" },
    width: String,
    label: String,
    column: String,
};

td.styles = css`
    :host {
        --display-header: none;
        display: table-cell;
        padding: var(--cell-padding);
        position: relative;
        vertical-align: var(--cell-align);
        border-right: var(--border-split);
        box-sizing: border-box;
    }
    :host-context([slot="header"]) {
        padding: var(--cell-header-padding);
    }
    :host-context(:not([collapse])) {
        width: var(--cell-width);
    }
    :host-context([collapse]) {
        --display-header: grid;
        display: grid;
    }
    .header {
        display: var(--display-header);
    }
`;

export const Td = c(td);
