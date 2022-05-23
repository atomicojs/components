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
function showDrag(props: Props<typeof showDrag>) {
    const host = useHost();
    const refWindow = useRef(window);
    const refActionable = useRef<HTMLElement>();
    const refContent = useRef<HTMLElement>();
    const [state, setState] = useDebounceState(1, 0, "fps");
    const [, setShow] = useProp<boolean>("show");
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const dragging = useDrag(refWindow, refActionable, {
        start(event) {
            const target =
                event instanceof TouchEvent ? event.targetTouches[0] : event;
            const { offset } = getCoordinates({
                pageX: target.pageX,
                pageY: target.pageY,
                currentTarget: refActionable.current,
            });
            setOffset(offset);
        },
        move(event) {
            const target =
                event instanceof TouchEvent ? event.targetTouches[0] : event;

            const { clientWidth } = host.current;

            setState(
                target.pageX > clientWidth ? 1 : target.pageX / clientWidth
            );
        },
    });

    useGesture(refWindow, refActionable, {
        right: (ms) => ms < 200 && setShow(true),
        left: (ms) => ms < 200 && setShow(false),
    });

    useEffect(() => {
        setShow(state >= 0.5);
    }, [dragging]);

    console.log(offset);

    return (
        <host shadowDom dragging={dragging}>
            <button
                class="drag"
                ref={refActionable}
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
            <div class="content" ref={refContent}>
                <slot></slot>
            </div>
            <style>
                {`:host{
                    --diff: ${state * 100}%;
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
    loader: {
        type: Boolean,
        reflect: true,
        value: true,
    },
};

showDrag.styles = css`
    @tokens "./tokens.yaml" (prefix: show-drag);

    :host {
        --content-order: -1;
        --transform: calc((-100%) + var(--drag-width));
        --transition: var(--drag-transition);
        position: fixed;
        display: flex;
        flex-flow: row nowrap;
        transform: translate(var(--transform));
        transition: var(--transition);
    }
    :host([dragging]) {
        --transition: 0s;
        --transform: calc(-100% + var(--diff, 0%));
    }
    :host(:not([dragging])[show]) {
        --transform: 0%;
    }
    :host([position="left"]) {
        height: 100%;
    }
    .drag {
        width: var(--drag-width);
        height: var(--drag-height);
        background: transparent;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }
    .drag-icon {
        width: 10%;
        height: 2rem;
        background: black;
        border-radius: 100px;
    }
    .content {
        order: var(--content-order);
    }
`;

export const ShowDrag = c(showDrag);

customElements.define("atomico-show-drag", ShowDrag);
