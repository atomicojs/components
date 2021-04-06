import {
  useHost,
  useEvent,
  useState,
  useUpdate,
  useLayoutEffect,
} from "atomico";

const SUBS = Symbol();
/**
 *
 */
function useStateTree(initialState, eventContext = "ConnectStateTree") {
  const host = useHost();

  const dispatch = useEvent(eventContext, {
    bubbles: true,
    composed: true,
  });

  const [proxy] = useState(() => {
    let proxy;

    dispatch((rootProxy) => (proxy = rootProxy));

    if (!proxy) {
      let subs = new Set();
      proxy = new Proxy(
        typeof initialState == "function" ? initialState() : initialState || {},
        {
          get(target, prop) {
            return target[prop];
          },
          set(target, prop, value) {
            if (prop == SUBS) {
              subs.add(value);
              return () => subs.delete(value);
            }
            if (target[prop] != value) {
              for (const sub of subs) {
                sub();
              }
            }
            return (target[prop] = value);
          },
        }
      );
    }

    host.remove = proxy[SUBS] = () => {
      requestUpdate();
    };

    return proxy;
  });

  const requestUpdate = useUpdate();

  useLayoutEffect(() => {
    const { current } = host;

    const listener = (event) => {
      event.stopPropagation();
      event.detail(proxy);
    };
    current.addEventListener(eventContext, listener);
    return () => {
      current.removeEventListener(eventContext, listener);
      host.remove();
    };
  }, []);

  return proxy;
}
