import { c, useLayoutEffect, useEvent, useProp } from "atomico";

function context({ destruct, composed }) {
  const [, setValue] = useProp("value");

  const dispatch = useEvent("ConnectContext", {
    bubbles: true,
    composed,
  });

  useLayoutEffect(() => {
    let dispatchDestroy;
    dispatch((destroy) => (dispatchDestroy = destroy));
    return () => destruct && dispatchDestroy();
  }, []);

  return (
    <host
      onConnectContext={(event) => {
        const [target] = event.composedPath();
        if (target != event.currentTarget) {
          event.stopPropagation();
          const { detail } = event;
          detail(() =>
            setValue((value) => ({
              ...value,
              [target.name]: null,
            }))
          );
          setValue((value) => {
            target.value = value[target.name] || {};
            return value;
          });
        }
      }}
      onChangeContext={(event) => {
        const [target] = event.composedPath();
        console.log(target);
        if (target != event.currentTarget) {
          event.stopPropagation();
          setValue((value) =>
            target.value == value[target.name]
              ? value
              : {
                  ...value,
                  [target.name]: target.value,
                }
          );
        }
      }}
    ></host>
  );
}

context.props = {
  name: String,
  value: {
    type: Object,
    reflect: true,
    event: {
      type: "ChangeContext",
      bubbles: true,
      composed: true,
    },
  },
  destruct: Boolean,
  composed: Boolean,
};

export const Context = c(context);
