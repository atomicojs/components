import { c, useEvent, useState, useHost, useEffect, useUpdate } from "atomico";

function routerCase() {
  return <host></host>;
}

routerCase.props = {
  slot: { type: String, reflect: true, value: "router-case" },
  path: { type: String, reflect: true, path: "/" },
  for: { type: String, reflect: true },
  load: null,
};

export const RouterCase = c(routerCase);
