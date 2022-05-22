import { Source } from "./preview-main";

export const globToSources = (
    modules: {
        [file: string]: { default: Source };
    },
    ignore?: string
) =>
    Object.entries(modules)
        .map(([file, { default: meta }]): Source => {
            const base = new URL(file, location.origin);
            return {
                ...meta,
                src: new URL("./index.html", base.href).pathname,
                menu: meta.menu
                    ? meta.menu.map((subSource) => {
                          const src = subSource.src
                              ? new URL(subSource.src, base.href).pathname
                              : null;
                          return {
                              ...subSource,
                              path: src ? src.replace(ignore, "") : null,
                              src,
                          };
                      })
                    : null,
            };
        })
        .sort((a, b) => (a.path > b.path ? 1 : -1));
