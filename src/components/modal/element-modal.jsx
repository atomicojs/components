import { c, useEffect, useProp, useRef } from "atomico";
import { useResponsiveState } from "@atomico/hooks/use-responsive-state";
import { useResizeObserverState } from "@atomico/hooks/use-resize-observer";

const style = /*css */ `
    :host{
      --x: 0px;
      --y: 0px;
      --transition: 1s ease all;
      --transform-from: scale(.9);
      --transform-to: scale(1);
      visibility: visible;
    }
    .frame{
      opacity: 0;
    }
    :host([show]) .frame{
      visibility: visible;
      opacity: 1;
    }
    :host([full-size]) .frame{
      width: 100%;
      height: 100%;
      position: fixed;
      display: block;
      transition: .5s ease all;
      top: 0px;
      left: 0px;
      background: var(--background, rgba(0,0,0,.15));
    }
    .container{
      max-width: 100%;
      max-height: 100%;
      position: fixed;
      box-sizing: border-box;
      transition: var(--transition);
      transform:   var(--transform-from);
      opacity: 0;
    }
    .content{
      position: relative;
    }
    :host([show]) .container{
      transform:  var(--transform-to);
      opacity: 1;
    }
    .button{
      min-width: 2.5rem;
      min-height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0px;
      border: 0px;
      position: absolute;
      top: .5rem;
      right: .5rem;
      background: var(--button-closed-background, #fff);
      color: var(--button-color, unset);
      border-radius: 25%;
      box-shadow: var(--button-closed-shadow, 0px 0px 12px rgba(0,0,0,.1));
    }
    .button svg rect {
      fill: var(--button-color, black);
    }
`;

function modal({
  padding,
  position,
  transition,
  showAfterMs,
  transformTo,
  transformFrom,
  fullSizeClosed,
  buttonClosedColor,
  buttonClosedBackground,
}) {
  const [, setShow] = useProp("show");

  const responsivePosition = useResponsiveState(position);
  const responsivePadding = useResponsiveState(padding || "");

  useEffect(() => {
    if (!showAfterMs) return;
    setTimeout(setShow, showAfterMs, true);
  }, [showAfterMs]);

  const ref = useRef();

  const rect = useResizeObserverState(ref);

  const [x, y = x] = responsivePosition.split(/\s+/);

  const styleX =
    x == "center"
      ? `left: calc( 50% - ${rect ? ref.current.clientWidth / 2 : "0"}px );`
      : x == "left"
      ? "left: 0%;"
      : x == "right"
      ? "right: 0px;"
      : x;

  const styleY =
    y == "center"
      ? `top: calc( 50% - ${rect ? ref.current.clientHeight / 2 : "0"}px );`
      : y == "top"
      ? "top: 0px;"
      : y == "bottom"
      ? "bottom: 0px;"
      : y;

  const closed = () => setShow(false);

  return (
    <host shadowDom>
      <style>
        {style}
        .container
        {`{${
          styleX +
          styleY +
          (responsivePadding ? "padding:" + responsivePadding : "")
        }}`}
        {transformFrom && `:host{--transform-from:${transformFrom}}`}
        {transformTo && `:host{--transform-from:${transformTo}}`}
        {transition && `:host{--transition:${transition}}`}
        {buttonClosedColor &&
          `:host{--button-closed-color:${buttonClosedColor}}`}
        {buttonClosedBackground &&
          `:host{--button-closed-background:${buttonClosedBackground}}`}
      </style>
      <span class="frame" onclick={fullSizeClosed && closed}>
        <slot name="background"></slot>
        <div class="container" ref={ref}>
          <div class="content">
            <slot name="closed">
              <button class="button" onclick={closed}>
                <svg viewBox="0 0 20 20" width="20" height="20">
                  <g transform="rotate(45 10 10)">
                    <rect rx="3" width="20" height="4" y="8"></rect>
                    <rect rx="3" width="4" height="20" x="8"></rect>
                  </g>
                </svg>
              </button>
            </slot>
            <slot
              onclick={({ target }) => {
                do {
                  if (target.dataset && "closed" in target.dataset) {
                    closed();
                    return;
                  }
                } while ((target = target.parentNode));
              }}
            ></slot>
          </div>
        </div>
      </span>
    </host>
  );
}

modal.props = {
  showAfterMs: Number,
  padding: String,
  show: {
    type: Boolean,
    reflect: true,
  },
  position: {
    type: String,
    value: "center",
  },
  fullSize: {
    type: Boolean,
    reflect: true,
  },
  fullSizeClosed: Boolean,
  transition: String,
  transformTo: String,
  transformFrom: String,
  buttonClosedColor: String,
  buttonClosedBackground: String,
};

export const Modal = c(modal);
