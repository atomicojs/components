import { Props, css, c, useEffect, useProp, useRef } from "atomico";
import { useResponsiveState } from "@atomico/hooks/use-responsive-state";

function modal({
    padding,
    position,
    showAfterMs,
    fullSize,
    fullSizeClosed,
}: Props<typeof modal>) {
    const [show, setShow] = useProp<boolean>("show");

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

    const closed = () => setShow(false);

    return (
        <host shadowDom>
            {fullSize && (
                <span
                    class="background"
                    onclick={fullSizeClosed && closed}
                    part={`background${show ? "-show" : ""}`}
                >
                    <slot name="background"></slot>
                </span>
            )}
            <div ref={ref} class="container" style={styleContainer}>
                <div class="content" part={`content${show ? "-show" : ""}`}>
                    <slot
                        onclick={(event: MouseEvent) => {
                            let { target } = event;
                            do {
                                if (
                                    target?.dataset &&
                                    "closed" in target?.dataset
                                ) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    closed();
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
    show: { type: Boolean, reflect: true },
    padding: { type: String, value: "" },
    position: { type: String, value: "center" },
    fullSize: { type: Boolean, reflect: true },
    fullSizeClosed: Boolean,
};

modal.styles = css`
    :host {
        --x: 0px;
        --y: 0px;
        --transition: 0.5s ease all;
        visibility: hidden;
    }
    :host([show]) {
        visibility: visible;
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
        overflow: auto;
        transition: var(--transition);
    }
    .content[part="content"],
    .background[part="background"] {
        opacity: 0;
    }
    .content[part="content-show"],
    .background[part="background-show"] {
        opacity: 1;
    }
`;

export const Modal = c(modal);

customElements.define("atomico-modal", Modal);
