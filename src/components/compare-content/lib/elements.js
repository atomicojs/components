import { jsx, jsxs } from "atomico/jsx-runtime";
import { useDebounceState } from "@atomico/hooks/use-debounce-state";
import { useListener } from "@atomico/hooks/use-listener";
import { useProxySlot } from "@atomico/hooks/use-slot";
import { useRef, useHost, useState, useEffect, css, c } from "atomico";

function compareContent({ value }) {
    const refContainer = useRef(globalThis);
    const refTrigger = useRef();
    const refHost = useHost();
    const refSlots = useRef();
    const [active, setActive] = useState(false);
    const [position, setPosition] = useDebounceState(
        1,
        { x: value, y: value },
        "fps"
    );
    const slotItems = useProxySlot(refSlots);
    const start = () => setActive(true);
    const end = () => setActive(false);
    useEffect(() => {
        if (position.x != value)
            setPosition({
                x: value,
                y: value,
            });
    }, [value]);
    useListener(refTrigger, "mousedown", start);
    useListener(refContainer, "mouseup", end);
    useListener(refContainer, "mouseleave", end);
    useListener(refTrigger, "touchstart", start);
    useListener(refContainer, "touchend", end);
    const onMove = (event) => {
        const { current } = refHost;
        if (active) {
            const rect = current.getBoundingClientRect();
            const isTouch = event instanceof TouchEvent;
            const offset = isTouch ? event.targetTouches[0] : event;
            const offsetX = offset.clientX - rect.x;
            const offsetY = offset.clientY - rect.y;
            if (isTouch) {
                event.preventDefault();
            }
            setPosition({
                x:
                    offsetX < 0
                        ? 0
                        : offsetX > rect.width
                        ? 1
                        : offsetX / rect.width,
                y:
                    offsetY < 0
                        ? 0
                        : offsetY > rect.height
                        ? 1
                        : offsetY / rect.height,
            });
        }
    };
    useListener(refContainer, "touchmove", onMove, { passive: false });
    useListener(refContainer, "mousemove", onMove, { passive: true });
    return /* @__PURE__ */ jsxs("host", {
        shadowDom: true,
        children: [
            /* @__PURE__ */ jsx("slot", { name: "content", ref: refSlots }),
            /* @__PURE__ */ jsx("style", {
                children: `
                :host{--x:${position.x};--y:${position.y}}
            `,
            }),
            /* @__PURE__ */ jsx("div", {
                class: "split-mask split-content",
                children: slotItems.map((item, i) =>
                    /* @__PURE__ */ jsx("slot", {
                        name: (item.slot = `item-${i + 1}`),
                    })
                ),
            }),
            /* @__PURE__ */ jsx("div", {
                class: "split-mask split-layer",
                children: /* @__PURE__ */ jsx("div", { class: "split" }),
            }),
            /* @__PURE__ */ jsx("div", {
                class: "split-mask split-layer",
                children: /* @__PURE__ */ jsx("div", {
                    class: "split split-trasparent",
                    children: /* @__PURE__ */ jsx("div", {
                        class: "split-center",
                        ref: refTrigger,
                        children: /* @__PURE__ */ jsx("slot", {
                            name: "trigger",
                            children: /* @__PURE__ */ jsx("button", {
                                class: "split-trigger",
                                children: /* @__PURE__ */ jsx("svg", {
                                    width: "12.001",
                                    height: "7.999",
                                    viewBox: "0 0 12.001 7.999",
                                    children: /* @__PURE__ */ jsx("path", {
                                        d: "M-6775-1004l4,4-4,4Zm-8,4,4-4v8Z",
                                        transform: "translate(6783.001 1004)",
                                        fill: "var(--icon-fill)",
                                    }),
                                }),
                            }),
                        }),
                    }),
                }),
            }),
        ],
    });
}
compareContent.props = {
    value: { type: Number, value: 0.5 },
    vertical: { type: Boolean, reflect: true },
    overflow: { type: Boolean, reflect: true },
};
compareContent.styles = css`
    :host {
        --line-width: var(--compare-content--line-width, 1px);
        --line-fill: var(--compare-content--line-fill, white);
        --icon-box-size: var(--compare-content--icon-box-size, 2rem);
        --icon-box-fill: var(--compare-content--icon-box-fill, #fff);
        --icon-box-radius: var(--compare-content--icon-box-radius, 100%);
        --icon-fill: var(--compare-content--icon-fill, #000);
    }

    :host {
        display: block;
        position: relative;
        width: auto;
        height: auto;
        --mask: polygon(
            calc(100% * var(--x)) 0%,
            100% 0%,
            100% 100%,
            calc(100% * var(--x)) 100%
        );
        --cursor: col-resize;
        --overflow: none;
    }

    .split-content {
        position: relative;
        z-index: 0;
    }

    .split-mask {
        overflow: var(--overflow);
    }

    .split-layer {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 2;
    }

    :host([vertical]) {
        --mask: polygon(
            0% calc(100% * var(--y)),
            100% calc(100% * var(--y)),
            100% 100%,
            0% 100%
        );
        --cursor: row-resize;
    }
    ::slotted(*) {
        max-width: 100%;
        width: 100%;
        display: block;
    }
    ::slotted([slot="item-2"]) {
        position: absolute;
        top: 0px;
        left: 0px;
        clip-path: var(--mask);
    }
    .split {
        width: var(--line-width);
        height: 100%;
        background: var(--line-fill);
        position: absolute;
        left: calc(100% * var(--x));
        transform: translateX(-50%);
        top: 0;
    }
    :host([vertical]) .split {
        width: 100%;
        height: var(--line-width);
        left: 0;
        top: calc(100% * var(--y));
        transform: translateY(-50%);
    }
    .split-center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .split-trigger {
        width: var(--icon-box-size);
        height: var(--icon-box-size);
        border-radius: var(--icon-box-radius);
        background: var(--icon-box-fill);
        border: var(--line-width) solid var(--line-fill);
        padding: none;
        cursor: var(--cursor);
    }
    .split-trasparent {
        background: transparent;
    }
`;
const CompareContent = c(compareContent);

export { CompareContent };
