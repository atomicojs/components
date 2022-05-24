import {
    Props,
    c,
    css,
    useRef,
    useHost,
    useEffect,
    useProp,
    useState,
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
}: Props<typeof showDrag>) {
    const host = useHost();
    const refWindow = useRef(window);
    const refActionable = useRef<HTMLElement>();
    const refContent = useRef<HTMLElement>();
    const [, setShow] = useProp<boolean>("show");
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
                const direction = value > pageValue;
                const move = direction ? value - pageValue : pageValue - value;
                const percent = (move > size ? size : move) / size;
                return direction ? percent : 1 - percent;
            };

            const y = getPercent(offset.rect.y, pageY, rect.height);
            const x = getPercent(offset.rect.x, pageX, rect.width);

            setDrag({
                x: 1 - x,
                y,
            });
        },
    });

    useGesture(refWindow, refActionable, {
        right: (ms) => ms > msMinDrag && ms < msMaxDrag && setShow(true),
        left: (ms) => ms > msMinDrag && ms < msMaxDrag && setShow(false),
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

    return (
        <host shadowDom dragging={dragging} ready={!!rect}>
            <div class="drag" ref={refActionable}>
                <button
                    class="drag-actionable"
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
            </div>
            <div class="content" ref={refContent}>
                <slot></slot>
            </div>
            <style>
                {`:host{
                    --offset-x: ${offset.x}px;
                    --offset-y: ${offset.y}px;
                    --drag-x: ${(1 - drag.x) * -1};
                    --drag-y: ${(1 - drag.y) * -1};
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
        --transform: calc((var(--move-x) * var(--drag-x))), 0px;
    }
    :host([ready][position="bottom"]) {
        width: 100%;
        --transform: 0, calc(var(--move-y) * 1);
    }
    :host([dragging][position="bottom"]) {
        --transform: 0px, calc(var(--move-y) * (var(--drag-y) * -1));
    }

    :host([ready][position="bottom"]) .drag-icon {
        height: var(--drag-icon-width);
        width: var(--drag-icon-height);
    }

    :host([ready][position="bottom"]) .drag {
        width: var(--drag-height);
        height: var(--drag-width);
    }

    .drag {
        width: var(--drag-width);
        height: var(--drag-height);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
    .drag-actionable {
        background: transparent;
        border: none;
        padding: 0;
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
