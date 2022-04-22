import { css } from "atomico";

export default css`
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
`;
