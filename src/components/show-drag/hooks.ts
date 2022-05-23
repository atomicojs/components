import { Ref, useRef, useState } from "atomico";
import { useListener } from "@atomico/hooks/use-listener";

export type DragEvent = MouseEvent | TouchEvent;

export interface Actions {
    start?: (event: DragEvent) => any;
    move?: (event: DragEvent) => any;
    end?: (eventStart: DragEvent, eventEnd: DragEvent) => any;
}

export interface ActionsGesture {
    left?: (ms: number) => any;
    right?: (ms: number) => any;
    up?: (ms: number) => any;
    down?: (ms: number) => any;
}

export function useGesture(
    refHost: Ref,
    refActionable: Ref,
    actions: ActionsGesture
) {
    useDrag(refHost, refActionable, {
        start(event) {
            if (event.cancelable) {
                event.preventDefault();
            }
        },
        end(eventStart, eventEnd) {
            const targetStart =
                eventStart instanceof TouchEvent
                    ? eventStart.changedTouches[0]
                    : eventStart;

            const targetEnd =
                eventEnd instanceof TouchEvent
                    ? eventEnd.changedTouches[0]
                    : eventEnd;

            const x = targetStart.pageX - targetEnd.pageX;
            const y = targetStart.pageY - targetEnd.pageY;

            const ms = eventEnd.timeStamp - eventStart.timeStamp;

            const action =
                Math.abs(x) > Math.abs(y)
                    ? x > 0
                        ? "left"
                        : "right"
                    : y > 0
                    ? "up"
                    : "down";

            if (actions[action]) actions[action](ms);
        },
        move(event) {
            if (event.cancelable) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        },
    });
}

export function useDrag(
    refHost: Ref,
    refActionable: Ref,
    actions: Actions
): boolean {
    const [active, setActive] = useState(false);
    const refEvent = useRef();

    const start = (event: DragEvent) => {
        refEvent.current = event;
        setActive(true);
        actions.start && actions.start(event);
    };

    const end = (event: DragEvent) => {
        setActive(false);
        active && actions.end && actions.end(refEvent.current, event);
    };

    const handle = (event: DragEvent) =>
        active && actions.move && actions.move(event);

    useListener(refActionable, "mousedown", start);

    useListener(refHost, "mouseup", end);

    useListener(refHost, "mouseleave", end);

    useListener(refActionable, "touchstart", start);

    useListener(refHost, "touchend", end);

    useListener(refHost, "touchmove", handle);

    useListener(refHost, "mousemove", handle);

    return active;
}
