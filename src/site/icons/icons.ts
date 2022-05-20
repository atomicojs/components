export default Object.entries(import.meta.globEager("./*.svg")).reduce(
    (files, [file, md]) => ({
        ...files,
        [file.replace(/.\/(.+)\.\w+$/, "$1")]: md.default,
    }),
    {}
) as {
    [index: string]: string;
};
