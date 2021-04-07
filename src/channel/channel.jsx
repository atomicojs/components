import { c, useEffect } from "atomico";
import { useChannel } from "@atomico/hooks/use-channel";

function child({ prop }) {
  const [value, setChannel] = useChannel("SyncProp");
  useEffect(() => {
    setChannel(prop || value);
  }, [prop, value]);
  return (
    <host shadowDom>
      <h2>child : {value}</h2>
      <slot></slot>
    </host>
  );
}

child.props = {
  prop: String,
};

customElements.define("c-child", c(child));
