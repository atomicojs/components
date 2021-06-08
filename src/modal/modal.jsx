import { c, useEffect, useProp, useRef } from "atomico";
import { useResponsiveState } from "@atomico/hooks/use-responsive-state";
import style from "./modal.css";

function modal({ padding, position, showAfterMs, fullSize, fullSizeClosed }) {
    const [show, setShow] = useProp("show");

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
                        onclick={
                            /**
                             * @param {MouseEvent} event
                             */
                            (event) => {
                                let { target } = event;
                                do {
                                    if (
                                        target.dataset &&
                                        "closed" in target.dataset
                                    ) {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        closed();
                                        return;
                                    }
                                } while ((target = target.parentNode));
                            }
                        }
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

modal.styles = style;

export const Modal = c(modal);

customElements.define("a-modal", Modal);
