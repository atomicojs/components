import { c, useEffect, useProp, useRef } from "atomico";
import { useResponsiveState } from "@atomico/hooks/use-responsive-state";
import { useResizeObserverState } from "@atomico/hooks/use-resize-observer";

const style = /*css */ `
    :host{
      --x: 0px;
      --y: 0px;
      --transition: .5s ease all;
      --transform-from: scale(.9);
      --transform-to: scale(1);
      visibility: hidden;
    }
    .frame{
      opacity: 0;
    }
    :host([show]){
      visibility: visible;
    }
    :host([full-size]) .frame{
      width: 100%;
      height: 100%;
      position: fixed;
      display: block;
      top: 0px;
      left: 0px;
      transition: .5s ease all;
      background: var(--background, rgba(0,0,0,.15));
    }
    :host([show][full-size]) .frame{
      opacity: 1;
    }
    :host([show]) .container{
      transform:  var(--transform-to);
      opacity: 1;
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
    ::slotted([slot=background]){
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
`;

function modal({
  padding,
  position,
  transition,
  showAfterMs,
  transformTo,
  transformFrom,
  fullSize,
  fullSizeClosed,
  background,
}) {
  const [, setShow] = useProp("show");

  const responsivePosition = useResponsiveState(position);
  const responsivePadding = useResponsiveState(padding || "");

  useEffect(() => {
    if (!showAfterMs) return;
    const id = setTimeout(setShow, showAfterMs, true);
    return () => clearTimeout(id);
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
        {background && `:host{--background:${background}}`}
      </style>
      {fullSize && (
        <span class="frame" onclick={fullSizeClosed && closed}>
          <slot name="background"></slot>
        </span>
      )}
      <div class="container" ref={ref} part="container">
        <div class="content">
          <slot
            onclick={
              /**
               * @param {any} event
               */
              ({ target }) => {
                do {
                  if (target.dataset && "closed" in target.dataset) {
                    closed();
                    return;
                  }
                } while ((target = target.parentNode));
              }
            }
          ></slot>
        </div>
      </div>
    </host>
  );
}

modal.props = {
  showAfterMs: Number,
  show: { type: Boolean, reflect: true },
  padding: { type: String, value: "" },
  position: { type: String, value: "center" },
  fullSize: { type: Boolean, reflect: true },
  fullSizeClosed: Boolean,
  transition: String,
  transformTo: String,
  transformFrom: String,
  background: String,
};

export const Modal = c(modal);
