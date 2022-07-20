---
{
    tags: ["{%", "%}"],
    questions: [{ type: "text", name: "name", message: "Component name?" }],
}
---

## component

```jsx {%name|kebabCase%}/src/{%name|kebabCase%}.tsx
import { c, css } from "atomico";

function {%name|camelCase%}() {
  return (
    <host shadowDom>
      <slot></slot>
    </host>
  );
}

{%name|camelCase%}.props = {
  myProp: String
};

{%name|camelCase%}.styles = css`
  :host {
    display: block;
  }
`;

export const {%name|pascalCase%} = c({%name|camelCase%});

customElements.define("atomico-{%name|kebabCase%}", {%name|pascalCase%});
```

## package.json

```json {%name|kebabCase%}/package.json
{
    "name": "@atomico/{%name|kebabCase%}",
    "version": "1.0.0",
    "type": "module",
    "publishConfig": {
        "access": "public"
    },
    "dependencies": {
        "atomico": "latest",
        "@atomico/hooks": "latest"
    },
    "peerDependencies": {
        "atomico": "latest",
        "@atomico/hooks": "latest",
        "@atomico/react": "latest"
    },
    "peerDependenciesMeta": {
        "@atomico/react": {
            "optional": true
        }
    },
    "scripts": {
        "component:publish": "exports src/*.tsx --types --exports --minify  --analyzer --publish"
    }
}
```

## .npmignore

```txt {%name|kebabCase%}/.npmignore
node_modules
/icon.svg
/preview.js
/index.html
/tsconfig.json
```

## tsconfig.json

```json {%name|kebabCase%}/tsconfig.json
{
    "extends": "@atomico/tsconfig/base.json",
    "include": ["src/**/*"]
}
```

## index.html

```html {%name|kebabCase%}/index.html
<link rel="stylesheet" href="../../preview.css" />
<script type="module" src="./src/{%name|kebabCase%}.tsx"></script>
<atomico-{%name|kebabCase%}></atomico-{%name|kebabCase%}>
```

## preview

```js {%name|kebabCase%}/preview.html
export default {
    label: "{%name%}",
    path: "/{%name|kebabCase%}",
    menu: [
        {
            label: "Documentation",
            href: "https://atomico.gitbook.io/doc/atomico/atomico-components/{%name|kebabCase%}",
        },
    ],
};
```
