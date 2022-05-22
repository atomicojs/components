import { Host, Ref, Props, c, css, useState, useRef, useHost } from "atomico";
import { useListener } from "@atomico/hooks/use-listener";
import { useDebounceState } from "@atomico/hooks/use-debounce-state";

function useDragResize(ref: Ref): [boolean, number] {
    const host = useHost();
    const [active, setActive] = useState(false);
    const [value, setValue] = useDebounceState(1, 1, "fps");

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

function iframeResize(props: Props<typeof iframeResize>): Host<{
    reload(): void;
}> {
    const refIframe = useRef<HTMLIFrameElement>();
    const refDragResize = useRef();
    const [active, offsetX] = useDragResize(refDragResize);
    const reload = () => (refIframe.current.src = props.src);
    return (
        <host shadowDom reload={reload}>
            <div class="mask">
                <iframe ref={refIframe} src={props.src} class="iframe"></iframe>
                {active && <div class="layer"></div>}
            </div>
            <div class="tools">
                <button class="button" onclick={reload}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        viewBox="0 0 15 12"
                    >
                        <path d="M7.5 11.999a6.007 6.007 0 0 1-6-6c0-.182.007-.351.021-.5h1a4.525 4.525 0 0 0-.026.5 5.006 5.006 0 0 0 5 5 4.991 4.991 0 0 0 2.312-.567l.736.736a6 6 0 0 1-3.043.831Zm5.978-5.5h-1c.017-.167.025-.333.025-.5a5.006 5.006 0 0 0-5-5 4.909 4.909 0 0 0-2.312.567L4.455.83A6 6 0 0 1 7.5-.001a6.006 6.006 0 0 1 6 6c0 .166-.007.333-.021.5Z" />
                        <path d="m2 2.999 2 3H0Z" />
                        <path d="m13 8.999-2-3h4Z" />
                    </svg>
                </button>
                <div class="drag" ref={refDragResize}>
                    <slot name="icon">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="5"
                            height="56"
                        >
                            <g
                                transform="translate(-1261 -346)"
                                fill="currentColor"
                            >
                                <rect
                                    width="1"
                                    height="56"
                                    rx=".5"
                                    transform="translate(1261 346)"
                                />
                                <rect
                                    width="1"
                                    height="56"
                                    rx=".5"
                                    transform="translate(1265 346)"
                                />
                            </g>
                        </svg>
                    </slot>
                </div>
                <button class="button">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10.001"
                        viewBox="0 0 10.001 9.998"
                    >
                        <path d="M0 10V0h4v1H1v8h8V6h1v4Zm3.441-4.187 4.814-4.812H7V0h3v3H9V1.67L4.149 6.518Z" />
                    </svg>
                </button>
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
        --tools-width: 40px;
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
        width: calc(var(--width) - var(--tools-width));
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
    .tools {
        width: var(--tools-width);
        height: 100%;
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        padding: 1rem 0px;
        box-sizing: border-box;
    }
    .drag {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: e-resize;
        padding: 1rem 0px;
    }
    .button {
        height: 2rem;
        padding: 0px;
        background: transparent;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
    .button:hover {
        background: rgba(0, 0, 0, 0.1);
    }
`;

export const IframeResize = c(iframeResize);

customElements.define("preview-iframe", IframeResize);
