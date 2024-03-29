import {
    Props,
    Host,
    css,
    c,
    useEffect,
    useProp,
    useRef,
    DOMEvent,
    useHost,
} from "atomico";
import { useResponsiveState } from "@atomico/hooks/use-responsive-state";

const SRC = Symbol("src");

function modal({
    padding,
    position,
    showAfterMs,
    fullSize,
    fullSizeClosed,
    lazyload,
}: Props<typeof modal>): Host<{
    onChangeShow: Event;
    open: () => void;
    closed: () => void;
    toggle: () => void;
}> {
    const host = useHost();
    const [show, setShow] = useProp<boolean>("show");
    const [inTransition, setTransition] = useProp<boolean>("inTransition");

    const responsivePosition = useResponsiveState(position);
    const responsivePadding = useResponsiveState(padding || "");

    useEffect(() => {
        if (!showAfterMs) return;
        const id = setTimeout(setShow, showAfterMs, true);
        return () => clearTimeout(id);
    }, [showAfterMs]);

    const ref = useRef();

    const [x, y = x] = responsivePosition.split(/\s+/);

    const styleX =
        x == "center"
            ? `left: 50%; --x: -50%;`
            : x == "left"
            ? "left: 0%;"
            : x == "right"
            ? "right: 0px;"
            : x;

    const styleY =
        y == "center"
            ? `top: 50%; --y: -50%;`
            : y == "top"
            ? "top: 0px;"
            : y == "bottom"
            ? "bottom: 0px;"
            : y;

    const styleContainer =
        styleX + styleY + (responsivePadding ? "--p:" + responsivePadding : "");

    const open = () => setShow(true);
    const closed = () => setShow(false);
    const toggle = () => setShow((show) => !show);

    useEffect(() => {
        if (lazyload) {
            host.current.querySelectorAll("[data-src]").forEach((node) => {
                const src = node.getAttribute("data-src");
                if (!(SRC in node)) {
                    node[SRC] = node.getAttribute("src") || "";
                }
                node.setAttribute("src", show ? src : node[SRC]);
            });
        }
    }, [show]);

    return (
        <host shadowDom closed={closed} toggle={toggle} open={open}>
            {fullSize && (
                <span
                    class="background"
                    onclick={fullSizeClosed && closed}
                    part={`background${show ? "-show" : ""}`}
                >
                    <slot name="background"></slot>
                </span>
            )}
            <div
                ontransitionend={() => setTransition(false)}
                ontransitionstart={() => setTransition(true)}
                ref={ref}
                class="container"
                style={styleContainer}
            >
                <div class="content" part={`content${show ? "-show" : ""}`}>
                    <slot
                        onclick={(
                            event: DOMEvent<HTMLSlotElement, MouseEvent>
                        ) => {
                            let { target } = event;
                            do {
                                if (
                                    //@ts-ignore
                                    target?.dataset &&
                                    //@ts-ignore
                                    "modal" in target?.dataset
                                ) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    //@ts-ignore
                                    const { modal } = target.dataset;
                                    if (modal == "open") {
                                        open();
                                    } else if (modal == "closed") {
                                        closed();
                                    } else if (modal == "toggle") {
                                        toggle();
                                    }
                                    return;
                                }
                            } while ((target = target.parentNode));
                        }}
                    ></slot>
                </div>
            </div>
        </host>
    );
}

modal.props = {
    showAfterMs: Number,
    show: {
        type: Boolean,
        reflect: true,
        event: {
            type: "ChangeShow",
        },
    },
    padding: { type: String, value: "" },
    position: { type: String, value: "center" },
    fullSize: { type: Boolean, reflect: true },
    lazyload: Boolean,
    fullSizeClosed: Boolean,
    inTransition: {
        type: Boolean,
        reflect: true,
    },
};

modal.styles = css`
    :host {
        --x: 0px;
        --y: 0px;
        --transition-timing: ease;
        --transition-delay: 0s;
        --transition-duration: 0.5s;
        --transition: var(--transition-duration) var(--transition-timing)
            var(--transition-delay);
        --visibility-in: visible;
        --visibility-out: hidden;
        --opacity-in: 1;
        --opacity-out: 0;
        visibility: var(--visibility-out);
    }
    :host([show]) {
        visibility: var(--visibility-in);
    }
    :host([full-size]) .background {
        width: 100%;
        height: 100%;
        position: fixed;
        display: block;
        top: 0px;
        left: 0px;
        transition: var(--transition);
    }
    ::slotted([slot="background"]) {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .container {
        max-width: 100%;
        max-height: 100%;
        position: fixed;
        box-sizing: border-box;
        transform: translate(var(--x, 0), var(--y, 0));
        padding: var(--p);
    }
    .content {
        position: relative;
        max-height: 100%;
        max-width: 100%;
        transition: var(--transition);
    }
    .content[part="content"],
    .background[part="background"] {
        opacity: var(--opacity-out);
    }
    .content[part="content-show"],
    .background[part="background-show"] {
        opacity: var(--opacity-in);
    }
`;

export const Modal = c(modal);
