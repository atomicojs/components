import { Props, c, css, useRef } from "atomico";
import { useProxySlot } from "@atomico/hooks/use-slot";
import { useDragResize } from "@atomico/hooks/use-drag-resize";

function compareContent({ value, vertical }: Props<typeof compareContent>) {
    const ref = useRef();
    const refDrag = useRef();
    const slots = useProxySlot<HTMLElement>(ref);
    const [, x, y] = useDragResize(refDrag, [value, value]);
    return (
        <host shadowDom>
            <slot name="content" ref={ref}></slot>
            <div class="mask" style={`--v:${vertical ? y : x};`}>
                {slots.map((child, i) => (
                    <div class={i ? "last" : "first"} staticNode>
                        <slot name={(child.slot = `content-${i}`)} />
                    </div>
                ))}
                <button class="drag" ref={refDrag} staticNode>
                    <div class="drag-icon" part="icon">
                        <slot name="icon">
                            <svg
                                width="12.001"
                                height="7.999"
                                viewBox="0 0 12.001 7.999"
                            >
                                <path
                                    d="M-6775-1004l4,4-4,4Zm-8,4,4-4v8Z"
                                    transform="translate(6783.001 1004)"
                                    fill="var(--icon-fill)"
                                />
                            </svg>
                        </slot>
                    </div>
                </button>
            </div>
        </host>
    );
}

compareContent.props = {
    value: { type: Number, value: 0.5 },
    vertical: { type: Boolean, reflect: true },
};

compareContent.styles = css`
    @tokens "../tokens.yaml" (prefix: compare-content);

    :host {
        display: inline-block;
        overflow: hidden;
        --v: 0.5;
        --cursor: col-resize;
        --icon-rotate: 0deg;
    }
    .mask {
        position: relative;
        --percent: calc(100% * var(--v));
    }
    .first {
        position: relative;
    }
    .last {
        position: absolute;
        top: 0px;
        left: 0px;
        clip-path: polygon(
            var(--percent) 0%,
            100% 0%,
            100% 100%,
            var(--percent) 100%
        );
    }
    .drag {
        all: unset;
        position: absolute;
        top: 0;
        left: var(--percent);
        transform: translate(-50%);
        width: var(--line-width);
        height: 100%;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: var(--cursor);
    }
    .drag-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--icon-box-size);
        height: var(--icon-box-size);
        min-width: var(--icon-box-size);
        min-height: var(--icon-box-size);
        background: var(--icon-box-fill);
        position: relative;
        border-radius: var(--icon-box-radius);
        transform: rotate(var(--icon-rotate));
    }
    :host([vertical]) {
        --cursor: row-resize;
        --icon-rotate: 90deg;
    }
    :host([vertical]) .drag {
        width: 100%;
        height: var(--line-width);
        left: 0;
        top: var(--percent);
        transform: translateY(-50%);
    }

    :host([vertical]) .last {
        clip-path: polygon(
            0% var(--percent),
            100% var(--percent),
            100% 100%,
            0% 100%
        );
    }
    ::slotted(img) {
        pointer-events: none;
    }
`;

export const CompareContent = c(compareContent);
