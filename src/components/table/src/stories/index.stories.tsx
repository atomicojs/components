import { useAsync } from "atomico";
import { Table, Tr, Td } from "@atomico/table";
import { define } from "@atomico/storybook";
import "./style.css";

export default {
    title: "@atomico/table",
    ...define(Table),
};

const data = fetch("https://example-data.draftbit.com/authors?_limit=10").then(
    (res) => res.json()
);

const useData = () => useAsync(() => data, []);

const Template = ({ data, ...props }: any) => (
    <Table class="table" breakpoint="(max-width: 520px)" {...props}>
        <Tr slot="header">
            <Td>Author</Td>
            <Td>Avatar</Td>
            <Td>Description</Td>
            <Td>Place of birth</Td>
            <Td>Link</Td>
        </Tr>
        {data.map(
            ({ person, imgUrl, sourceUrl, description, placeOfBirth }) => (
                <Tr>
                    <Td>{person}</Td>
                    <Td>
                        <img
                            class="avatar"
                            width="30"
                            height="30"
                            loading="lazy"
                            src={imgUrl}
                        />
                    </Td>
                    <Td>{description}</Td>
                    <Td>{placeOfBirth}</Td>
                    <Td>
                        <a class="button" href={sourceUrl}>
                            Wiki
                        </a>
                    </Td>
                </Tr>
            )
        )}
    </Table>
);

export const Story1 = (props) => {
    const data = useData();
    return <Template {...props} data={data} id="table-1"></Template>;
};

export const Story2 = (props) => {
    const data = useData();
    return <Template {...props} data={data} id="table-2"></Template>;
};

export const Story3 = (props) => {
    const data = useData();
    return <Template {...props} data={data} id="table-3"></Template>;
};
