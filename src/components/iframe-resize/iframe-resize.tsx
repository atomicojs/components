import { Props, c, css, useProp, useState } from "atomico";
function iframeResize(props: Props<typeof iframeResize>) {
    const [resize, setResize] = useProp<boolean>("resize");
    const [state, setState] = useState(1);
    return (
        <host
            shadowDom
            onmouseup={() => setResize(false)}
            onmouseleave={() => setResize(false)}
            onmousemove={
                resize &&
                ((event) => {
                    const p = event.offsetX / event.currentTarget.clientWidth;
                    setState(p);
                })
            }
        >
            <iframe src={props.src} class="iframe"></iframe>
            <div
                class="resize"
                onmousedown={() => {
                    setResize(true);
                }}
            >
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
                --width: ${100 * state}%;
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
        width: calc(var(--width) - 30px);
        border: none;
        background: var(--iframe-bg);
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
