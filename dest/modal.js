import { jsx as t } from "atomico/jsx-runtime";
import { c as o, useProp as r, useEffect as i, useRef as e } from "atomico";
import { useResponsiveState as n } from "@atomico/hooks/use-responsive-state";
import { useResizeObserverState as s } from "@atomico/hooks/use-resize-observer";
function a({
  padding: o,
  position: a,
  transition: l,
  showAfterMs: c,
  transformTo: f,
  transformFrom: m,
  fullSize: p,
  fullSizeClosed: d,
  background: h,
}) {
  const [, u] = r("show"),
    g = n(a),
    b = n(o || "");
  i(() => {
    if (!c) return;
    const t = setTimeout(u, c, !0);
    return () => clearTimeout(t);
  }, [c]);
  const v = e(),
    x = s(v),
    [y, k = y] = g.split(/\s+/),
    w =
      "center" == y
        ? `left: calc( 50% - ${x ? v.current.clientWidth / 2 : "0"}px );`
        : "left" == y
        ? "left: 0%;"
        : "right" == y
        ? "right: 0px;"
        : y,
    S =
      "center" == k
        ? `top: calc( 50% - ${x ? v.current.clientHeight / 2 : "0"}px );`
        : "top" == k
        ? "top: 0px;"
        : "bottom" == k
        ? "bottom: 0px;"
        : k,
    z = () => u(!1);
  return t(
    "host",
    { shadowDom: !0 },
    t(
      "style",
      null,
      ":host{--x:0px;--y:0px;--transition:.5s ease all;--transform-from:scale(.9);--transform-to:scale(1);visibility:hidden}.frame{opacity:0}:host([show]){visibility:visible}:host([full-size]) .frame{width:100%;height:100%;position:fixed;display:block;top:0;left:0;transition:.5s ease all;background:var(--background, rgba(0,0,0,.15))}:host([show][full-size]) .frame{opacity:1}:host([show]) .container{transform:var(--transform-to);opacity:1}.container{max-width:100%;max-height:100%;position:fixed;box-sizing:border-box;transition:var(--transition);transform:var(--transform-from);opacity:0}.content{position:relative}::slotted([slot=background]){width:100%;height:100%;object-fit:cover}",
      ".container",
      `{${w + S + (b ? "padding:" + b : "")}}`,
      m && `:host{--transform-from:${m}}`,
      f && `:host{--transform-from:${f}}`,
      l && `:host{--transition:${l}}`,
      h && `:host{--background:${h}}`
    ),
    p &&
      t(
        "span",
        { class: "frame", onclick: d && z },
        t("slot", { name: "background" })
      ),
    t(
      "div",
      { class: "container", ref: v, part: "container" },
      t(
        "div",
        { class: "content" },
        t("slot", {
          onclick: ({ target: t }) => {
            do {
              if (t.dataset && "closed" in t.dataset) return void z();
            } while ((t = t.parentNode));
          },
        })
      )
    )
  );
}
a.props = {
  showAfterMs: Number,
  show: { type: Boolean, reflect: !0 },
  padding: { type: String, value: "" },
  position: { type: String, value: "center" },
  fullSize: { type: Boolean, reflect: !0 },
  fullSizeClosed: Boolean,
  transition: String,
  transformTo: String,
  transformFrom: String,
  background: String,
};
const l = o(a);
export { l as Modal };
