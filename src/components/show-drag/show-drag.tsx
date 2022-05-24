import {
    Props,
    c,
    css,
    useRef,
    useHost,
    useEffect,
    useProp,
    useState,
    Host,
} from "atomico";
import { useDrag, useGesture } from "./hooks";
import { useDebounceState } from "@atomico/hooks/use-debounce-state";
import { getCoordinates } from "@atomico/hooks/use-click-coordinates";
import { useResizeObserverState } from "@atomico/hooks/use-resize-observer";

function showDrag({
    position,
    msMinDrag,
    msMaxDrag,
    minSizeShow,
}: Props<typeof showDrag>): Host<{ toggle(): void }> {
    const host = useHost();
    const refWindow = useRef(window);
    const refActionable = useRef<HTMLElement>();
    const refContent = useRef<HTMLElement>();
    const [show, setShow] = useProp<boolean>("show");
    const [offset, setOffset] = useState({ x: 0, y: 0, rect: { x: 0, y: 0 } });
    const rect = useResizeObserverState(refContent);
    const [drag, setDrag] = useDebounceState(1, { x: 0, y: 0 }, "fps");

    const [, dragging] = useDrag(refWindow, refActionable, {
        start(event) {
            const target =
                event instanceof TouchEvent ? event.targetTouches[0] : event;

            const { offset } = getCoordinates({
                pageX: target.pageX,
                pageY: target.pageY,
                currentTarget: refActionable.current,
            });

            const { x, y } = refActionable.current.getBoundingClientRect();

            setOffset({ ...offset, rect: { x, y } });
        },
        move(event) {
            const target =
                event instanceof TouchEvent ? event.targetTouches[0] : event;

            let { pageX, pageY } = target;

            pageX -= offset.x;
            pageY -= offset.y;

            const getPercent = (
                value: number,
                pageValue: number,
                size: number
            ) => {
                const move = Math.abs(pageValue - value);
                return (move > size ? size : move) / size;
            };

            const dY = offset.rect.y > pageY;
            const dX = offset.rect.x < pageX;

            const y =
                dY && show ? 0 : getPercent(offset.rect.y, pageY, rect.height);

            const x =
                dX && show ? 0 : getPercent(offset.rect.x, pageX, rect.width);

            setDrag({
                x,
                y,
            });
        },
    });

    useGesture(refWindow, refActionable, {
        right: (ms) =>
            position === "left" &&
            ms > msMinDrag &&
            ms < msMaxDrag &&
            setShow(true),
        left: (ms) =>
            position === "left" &&
            ms > msMinDrag &&
            ms < msMaxDrag &&
            setShow(false),
        down: (ms) =>
            position === "bottom" &&
            ms > msMinDrag &&
            ms < msMaxDrag &&
            setShow(false),
        up: (ms) =>
            position === "bottom" &&
            ms > msMinDrag &&
            ms < msMaxDrag &&
            setShow(true),
    });

    useEffect(() => {
        if (dragging) return;

        const showX = drag.x >= minSizeShow;
        const showY = drag.y >= minSizeShow;

        if (position === "bottom") {
            setShow(showY);
        } else {
            setShow(showX);
        }
    }, [dragging]);

    useEffect(() => {
        document.body.style.setProperty("touch-action", "none");
        return () => document.body.style.removeProperty("touch-action");
    }, []);

    const toggle = () => setShow((show) => !show);

    return (
        <host shadowDom dragging={dragging} ready={!!rect} toggle={toggle}>
            <div class="drag" ref={refActionable}>
                <div class="drag-visible">
                    <slot name="drag-visible"></slot>
                </div>
                <div class="drag-banner">
                    <div>
                        <slot name="drag-start"></slot>
                    </div>
                    <button
                        class="drag-actionable"
                        ondblclick={() => setShow((show) => !show)}
                        onkeydown={(event) => {
                            if (event.code === "Space") {
                                setShow((show) => !show);
                            }
                        }}
                    >
                        <slot name="drag-icon">
                            <div class="drag-icon"></div>
                        </slot>
                    </button>
                    <div>
                        <slot name="drag-end"></slot>
                    </div>
                </div>
            </div>
            <div class="content" ref={refContent}>
                <slot></slot>
            </div>
            <style>
                {`:host{
                    --offset-x: ${offset.x}px;
                    --offset-y: ${offset.y}px;
                    --drag-x: ${drag.x};
                    --drag-y: ${drag.y};
                    --move-x: ${rect?.width || 0}px;
                    --move-y: ${rect?.height || 0}px;
                }`}
            </style>
        </host>
    );
}

showDrag.props = {
    show: {
        type: Boolean,
        reflect: true,
    },
    dragging: {
        type: Boolean,
        reflect: true,
    },
    position: {
        type: String,
        reflect: true,
        value: (): "left" | "bottom" | "right" => "left",
    },
    ready: {
        type: Boolean,
        reflect: true,
    },
    msMinDrag: {
        type: Number,
        value: 50,
    },
    msMaxDrag: {
        type: Number,
        value: 300,
    },
    minSizeShow: {
        type: Number,
        value: 0.5,
    },
};

showDrag.styles = css`
    @tokens "./tokens.yaml" (prefix: show-drag);

    :host {
        --content-order: -1;
        --transition: var(--drag-transition);
        --actionable-width: var(--drag-actionable-width);
        --actionable-height: auto;
        --banner-flow: column;
        position: fixed;
        display: flex;
        flex-flow: row nowrap;
        transform: translate(var(--transform));
        overscroll-behavior: contain;
    }
    :host([ready]) {
        transition: var(--transition);
    }
    :host([dragging]) {
        --transition: 0s;
    }
    :host([position="left"]) {
        left: 0;
        top: 0;
        --transform: calc((-100%) + var(--drag-width));
    }

    :host([position="bottom"]) {
        left: 0;
        bottom: 0;
        flex-flow: column-reverse;
        --drag-row-flow: column-reverse;
        --drag-row-width: 100%;
        --banner-flow: row;
        --actionable-width: auto;
        --actionable-height: var(--drag-actionable-width);
        --transform: 0px, calc((100%) + var(--drag-width));
    }
    :host(:not([dragging])[position][show]) {
        --transform: 0;
    }
    :host([ready][position="left"]) {
        height: 100%;
        --transform: calc(var(--move-x) * -1);
    }

    :host([dragging][position="left"]) {
        --transform: calc(
                (var(--move-x) - (var(--move-x) * var(--drag-x))) * -1
            ),
            0px;
    }
    :host([show][dragging][position="left"]) {
        --transform: calc((var(--move-x) * var(--drag-x)) * -1), 0px;
    }
    :host([ready][position="bottom"]) {
        width: 100%;
        --transform: 0, calc(var(--move-y) * 1);
    }
    :host([dragging][position="bottom"]) {
        --transform: 0px, calc(var(--move-y) - (var(--move-y) * var(--drag-y)));
    }
    :host([show][dragging][position="bottom"]) {
        --transform: 0px, calc(var(--move-y) * var(--drag-y));
    }

    :host([position="bottom"]) .drag-icon {
        height: var(--drag-icon-width);
        width: var(--drag-icon-height);
    }

    :host([position="bottom"]) .drag-banner {
        width: 100%;
    }

    .drag {
        width: auto;
        display: flex;
        flex-flow: var(--drag-row-flow);
        cursor: pointer;
    }

    .drag-banner {
        width: var(--drag-row-width);
        display: flex;
        flex-flow: var(--banner-flow);
        justify-content: space-between;
        align-items: center;
    }

    .drag-visible {
        width: var(--drag-row-width);
    }

    .drag-actionable {
        width: var(--actionable-width);
        height: var(--actionable-height);
        background: transparent;
        border: none;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .drag-icon {
        width: var(--drag-icon-width);
        height: var(--drag-icon-height);
        background: var(--drag-icon-color);
        border-radius: var(--drag-icon-radius);
    }
    .content {
        order: var(--content-order);
    }
`;

export const ShowDrag = c(showDrag);

customElements.define("atomico-show-drag", ShowDrag);
