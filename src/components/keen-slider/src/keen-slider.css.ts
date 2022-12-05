import { css } from "atomico";

export default css`
    :host {
        position: relative;
        --opacity-disabled: 0.5;
        --cursor-left: pointer;
        --cursor-right: pointer;
        --pointer-events-left: unset;
        --pointer-events-right: unset;
    }
    .keen-slider {
        max-height: 100%;
    }
    .keen-slider:not([data-keen-slider-disabled]) {
        align-content: flex-start;
        display: flex;
        overflow: hidden;
        position: relative;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
        -khtml-user-select: none;
        touch-action: pan-y;
        -webkit-tap-highlight-color: transparent;
        width: 100%;
    }
    .keen-slider:not([data-keen-slider-disabled]) .keen-slider__slide {
        position: relative;
        overflow: hidden;
        width: 100%;
        min-height: 100%;
    }
    .keen-slider:not([data-keen-slider-disabled])[data-keen-slider-reverse] {
        flex-direction: row-reverse;
    }
    .keen-slider:not([data-keen-slider-disabled])[data-keen-slider-v] {
        flex-wrap: wrap;
    }
    .keen-slider:not([data-keen-slider-disabled])[data-keen-slider-moves] * {
        pointer-events: none;
    }
    [name="pagination"] {
        display: none;
    }
    ::slotted([slot="to-left"]) {
        cursor: var(--cursor-left);
        opacity: var(--opacity-left);
        pointer-events: var(--pointer-events-left);
    }
    ::slotted([slot="to-right"]) {
        cursor: var(--cursor-right);
        opacity: var(--opacity-right);
        pointer-events: var(--pointer-events-right);
    }
    :host([disable-left]) {
        --pointer-events-left: none;
        --opacity-left: var(--opacity-disabled);
    }
    :host([disable-right]) {
        --opacity-right: var(--opacity-disabled);
        --pointer-events-right: none;
    }
`;
