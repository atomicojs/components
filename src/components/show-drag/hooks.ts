import { Ref, useRef, useState, useEffect } from "atomico";
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
    });
}

export function useDrag(
    refHost: Ref,
    refActionable: Ref,
    actions: Actions
): [boolean, boolean] {
    const [active, setActive] = useState(false);
    const [dragging, setDragging] = useState(false);
    const refEvent = useRef();

    const mode = { passive: true };

    const start = (event: DragEvent) => {
        refEvent.current = event;
        setActive(true);
        actions.start && actions.start(event);
    };

    const end = (event: DragEvent) => {
        setActive(false);
        if (active) {
            actions.end && actions.end(refEvent.current, event);
            setDragging(false);
        }
    };

    const handle = (event: DragEvent) => {
        if (active) {
            actions.move && actions.move(event);
            setDragging(true);
        }
    };

    useListener(refActionable, "mousedown", start, mode);

    useListener(refHost, "mouseup", end, mode);

    useListener(refHost, "mouseleave", end, mode);

    useListener(refActionable, "touchstart", start, mode);

    useListener(refHost, "touchend", end, mode);

    useListener(refHost, "touchmove", handle, mode);

    useListener(refHost, "mousemove", handle, mode);

    return [active, dragging];
}
