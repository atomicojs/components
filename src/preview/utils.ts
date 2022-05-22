import { Source } from "./preview";

export const globToSources = (modules: {
    [file: string]: { default: Source };
}) =>
    Object.entries(modules).map(([file, { default: meta }]): Source => {
        const base = new URL(file, location.origin);
        return {
            ...meta,
            src: new URL("./index.html", base.href).pathname,
            menu: meta.menu
                ? meta.menu.map((subSource) => ({
                      ...subSource,
                      src: subSource.src
                          ? new URL(subSource.src, base.href).pathname
                          : null,
                  }))
                : null,
        };
    });
