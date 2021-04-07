# @uppercod/components(work in progress)

```jsx
function parent({ path }) {
  const [rootState, setChannel] = useChannel("GetPath");

  useEffect(() => {
    setChannel({ state, path });
  }, [state, path]);
}
function child() {
  const every = useConnectParent("local");
}
```
