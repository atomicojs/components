import { useListener, useListenerState } from "@atomico/hooks/use-listener";
import {
    Ref,
    Props,
    c,
    css,
    useProp,
    useState,
    useRef,
    useHost,
} from "atomico";

function useDragResize(ref: Ref): [boolean, number] {
    const host = useHost();
    const [active, setActive] = useState(false);
    const [value, setValue] = useState(1);

    useListener(ref, "mousedown", () => {
        setActive(true);
    });

    useListener(host, "mouseup", () => {
        setActive(false);
    });

    useListener(host, "mouseleave", () => {
        setActive(false);
    });

    useListener(host, "mousemove", (event: MouseEvent) => {
        if (active) {
            setValue(event.offsetX / host.current.clientWidth);
        }
    });

    return [active, value];
}

function iframeResize(props: Props<typeof iframeResize>) {
    const refDragResize = useRef();
    const [active, offsetX] = useDragResize(refDragResize);

    return (
        <host shadowDom>
            <div class="mask">
                <iframe src={props.src} class="iframe"></iframe>
                {active && <div class="layer"></div>}
            </div>
            <div class="resize" ref={refDragResize}>
                <slot name="resize-icon">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="5"
                        height="56"
                    >
                        <g
                            data-name="Group 75"
                            transform="translate(-1261 -346)"
                            fill="currentColor"
                        >
                            <rect
                                data-name="Rectangle 178"
                                width="1"
                                height="56"
                                rx=".5"
                                transform="translate(1261 346)"
                            />
                            <rect
                                data-name="Rectangle 179"
                                width="1"
                                height="56"
                                rx=".5"
                                transform="translate(1265 346)"
                            />
                        </g>
                    </svg>
                </slot>
            </div>
            <style>{`:host{
                --width: ${100 * offsetX}%;
            }`}</style>
        </host>
    );
}

iframeResize.props = {
    src: String,
    resize: {
        type: Boolean,
        reflect: true,
    },
};

iframeResize.styles = css`
    :host {
        --iframe-bg: #f1f1f9;
    }
    :host,
    .iframe {
        width: 100%;
        height: 100%;
    }
    :host {
        display: flex;
    }
    .iframe {
        width: 100%;
        border: none;
        background: var(--iframe-bg);
    }
    .mask {
        width: calc(var(--width) - 30px);
        position: relative;
    }
    .layer {
        position: absolute;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
    }
    .resize {
        width: 30px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: e-resize;
    }
`;

export const IframeResize = c(iframeResize);

customElements.define("atomico-iframe-resize", IframeResize);
