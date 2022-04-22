import {
    Host,
    Props,
    c,
    useEffect,
    useProp,
    css,
    useHost,
    useRef,
} from "atomico";
import { useChildNodes } from "@atomico/hooks/use-child-nodes";
import { useMutationObserver } from "@atomico/hooks/use-mutation-observer";
import Keen from "keen-slider";
import style from "./keen-slider.css";

function component(
    props: Props<typeof component>
): Host<{ onSliderMounted: Event }> {
    const host = useHost();
    const refSlider = useRef();
    const [childNodes, update] = useChildNodes();
    const children = childNodes.filter((child) =>
        child instanceof HTMLElement
            ? props.selector
                ? child.matches(props.selector)
                : !child.slot || child.slot.startsWith("slide-")
            : false
    ) as HTMLElement[];

    useMutationObserver(host, update, { childList: true });

    const [slider, setSlider] = useProp("slider");
    const [hover, setHover] = useProp<boolean>("hover");
    const [currentIndex, setCurrentIndex] = useProp<number>("currentSlide");

    useEffect(() => {
        const slider = new Keen(refSlider.current, {
            slideChanged(slider) {
                setCurrentIndex(slider.track.details.rel);
            },
            ...Object.entries({
                vertical: props.vertical,
                breakpoints: props.breakpoints,
                duration: props.duration,
                drag: props.drag,
                dragSpeed: props.dragSpeed,
                initial: props.initial,
                loop: props.loop || props.autoplay,
                mode: props.mode,
                rtl: props.rtl,
                rubberband: props.rubberband,
                slides: [
                    ["perView", props.slidesPerView],
                    ["spacing", props.slidesSpacing],
                    ["origin", props.slidesOrigin],
                ]
                    .filter(([, value]) => value != null)
                    .reduce(
                        (props, [prop, value]) =>
                            //@ts-ignore
                            ({ ...props, [prop]: value }),
                        {}
                    ),
            })
                .filter(([, value]) => value != null)
                .reduce(
                    (props, [prop, value]) => ({
                        ...props,
                        [prop]: value,
                    }),
                    {}
                ),
        });

        setSlider(slider);
    }, []);

    useEffect(() => {
        if (!slider || !props.autoplay) return;

        if (!hover) {
            const interval = setInterval(
                () => slider.next(),
                props.autoplayLoop
            );
            return () => clearInterval(interval);
        }
    }, [slider, hover, props.autoplay, props.autoplayLoop]);

    return (
        <host
            shadowDom
            onmouseover={() => setHover(true)}
            onmouseleave={() => setHover(false)}
        >
            <div class="keen-slider" ref={refSlider}>
                {children.map((el, index) => (
                    <div class="keen-slider__slide">
                        <slot name={(el.slot = "slide-" + index)}></slot>
                    </div>
                ))}
            </div>
            <slot part="to-left" name="to-left" onclick={slider?.prev}></slot>
            <slot part="to-right" name="to-right" onclick={slider?.next}></slot>
            {props.dots && (
                <div
                    part="dots"
                    class="dots"
                    style={`--dots-length: ${children.length}`}
                >
                    {children.map((el, index) => (
                        <button
                            part="dots-item"
                            class={`dots-item ${
                                currentIndex === index
                                    ? "dots-item--active"
                                    : ""
                            }`}
                            onclick={() => slider?.moveToIdx(index)}
                        ></button>
                    ))}
                </div>
            )}
        </host>
    );
}

component.props = {
    currentSlide: {
        type: Number,
        value: 0,
    },
    breakpoints: Object,
    duration: Number,
    disabled: Boolean,
    drag: Boolean,
    dragSpeed: Number,
    initial: Number,
    loop: Boolean,
    autoplay: Boolean,
    autoplayLoop: {
        type: Number,
        value: 2000,
    },
    slidesPerView: Number,
    slidesSpacing: Number,
    slidesOrigin: String,
    dots: Boolean,
    hover: {
        type: Boolean,
        reflect: true,
    },
    mode: {
        type: String,
        value: (): "snap" | "free" | "free-snap" => "snap",
    },
    range: {
        type: Object,
        value: (): { min?: number; max?: number; align?: boolean } => ({}),
    },
    rtl: Boolean,
    rubberband: Boolean,
    selector: String,
    vertical: { type: Boolean, reflect: true },
    slider: {
        type: Object,
        event: { type: "SliderMounted" },
    },
};

component.styles = [
    style,
    css`
        :host {
            position: relative;
            display: block;
            --dots-gap: 1rem;
            --dots-opacity: 0.5;
            --dots-transition: 0.3s ease all;
        }
        ::slotted([slot="to-left"]),
        ::slotted([slot="to-right"]) {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            z-index: 1;
        }
        ::slotted([slot="to-left"]) {
            left: 0;
        }
        ::slotted([slot="to-right"]) {
            right: 0;
        }
        .dots {
            position: absolute;
            bottom: 0px;
            left: 50%;
            z-index: 2;
            display: grid;
            grid-template-columns: repeat(var(--dots-length), auto);
            grid-gap: var(--dots-gap);
            transform: translate(-50%, -100%);
        }
        .dots-item {
            width: 10px;
            height: 10px;
            padding: 0px;
            border-radius: 100px;
            border: none;
            color: white;
            cursor: pointer;
            opacity: var(--dots-opacity);
            transition: var(--dots-transition);
        }
        .dots-item--active {
            --dots-opacity: 1;
        }
    `,
];

export const KeenSlider = c(component);

customElements.define("atomico-keen-slider", KeenSlider);
