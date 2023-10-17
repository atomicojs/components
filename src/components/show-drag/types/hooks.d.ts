import { Ref } from "atomico";
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
export declare function useGesture(refHost: Ref, refActionable: Ref, actions: ActionsGesture): void;
export declare function useDrag(refHost: Ref, refActionable: Ref, actions: Actions): [boolean, boolean];
