import {
    Type,
    Host,
    Props,
    c,
    css,
    useEffect,
    useRef,
    useState,
    useProp,
    useEvent,
} from "atomico";
import { loadScript } from "@atomico/hooks/use-script";
import { LottiePlayer, AnimationItem } from "lottie-web";
import { usePromise } from "@atomico/hooks/use-promise";
import { useIntersectionObserver } from "@atomico/hooks/use-intersection-observer";
import { addListener } from "@atomico/hooks/use-listener";

export const cdn = {
    url: "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.9.1/lottie.min.js",
};

function componentLottie(props: Props<typeof componentLottie>): Host<{
    onLoaded: Event;
    onDataReady: Event;
    onComplete: Event;
    onLoopComplete: Event;
    onEnterFrame: Event;
    onSegmentStart: Event;
    onIntersection: CustomEvent<IntersectionObserverEntry>;
    onCreateAnimation: Event;
}> {
    const ref = useRef();
    const [animation, setAnimation] = useProp<AnimationItem>("animation");
    const [load, setLoad] = useState<boolean>(!props.lazyload);
    const [intersection, setIntersection] = useProp<boolean>("intersection");
    const dispatchLoaded = useEvent("Loaded");
    const dispatcDataReady = useEvent("DataReady");
    const dispatchComplete = useEvent("Complete");
    const dispatchLoopComplete = useEvent("LoopComplete");
    const dispatchEnterFrame = useEvent("EnterFrame");
    const dispatchSegmentStart = useEvent("SegmentStart");
    const dispatchIntersection = useEvent("Intersection");

    useIntersectionObserver(
        ([entries]) => {
            const { isIntersecting } = entries;
            setLoad((load) => load || isIntersecting);
            setIntersection(isIntersecting);

            dispatchIntersection(entries);
        },
        {
            rootMargin: props.intersectionOffset,
            threshold: props.intersectionThreshold || 0.1,
        }
    );

    const [lottie, status] = usePromise(async (): Promise<LottiePlayer> => {
        if (props.cdn) {
            await loadScript(cdn.url);
            //@ts-ignore
            return window.lottie as any;
        } else {
            return import("lottie-web") as any;
        }
    }, load);

    useEffect(() => {
        if (status != "fulfilled") return;

        const data = lottie.loadAnimation({
            wrapper: ref.current,
            //@ts-ignore
            renderer: props.renderer,
            loop: true,
            path: props.path,
            animationData: props.data,
        }) as any;

        const unlisteners = [
            addListener(data, "complete", dispatchComplete),
            addListener(data, "loopComplete", dispatchLoopComplete),
            addListener(data, "data_ready", dispatcDataReady),
            addListener(data, "enterFrame", dispatchEnterFrame),
            addListener(data, "segmentStart", dispatchSegmentStart),
            addListener(data, "DOMLoaded", dispatchLoaded),
        ];

        setAnimation(data);

        return () => unlisteners.forEach((fn) => fn());
    }, [status, props.path]);

    useEffect(() => {
        if (props.intersectionControl && animation) {
            if (intersection) {
                animation.play();
            } else if (props.intersectionControlReplay) {
                animation.stop();
            } else {
                animation.pause();
            }
        }
    }, [intersection, animation]);

    return (
        <host shadowDom>
            <div class="frame" ref={ref}></div>
            <slot slot="player"></slot>
        </host>
    );
}

componentLottie.props = {
    cdn: Boolean,
    path: String,
    loop: Boolean,
    lazyload: {
        type: Boolean,
        reflect: true,
    },
    intersection: {
        type: Boolean,
        reflect: true,
    },
    intersectionOffset: String,
    intersectionThreshold: null as Type<number | number[]>,
    intersectionControl: Boolean,
    intersectionControlReplay: Boolean,
    autoplay: Boolean,
    data: Object,
    animation: {
        type: null as Type<AnimationItem>,
        event: {
            type: "CreateAnimation",
        },
    },
    renderer: {
        type: String,
        value: (): "svg" | "canvas" | "html" => "svg",
    },
};

componentLottie.styles = css`
    :host {
        display: block;
    }
    :host([lazyload]) {
        min-height: 1px;
    }
`;

const Lottie = c(componentLottie);

customElements.define("atomico-lottie", Lottie);
