import MarkdownIt from "markdown-it";
import type {FC} from "react";

const md = new MarkdownIt();

interface MarkdownProps {
    text: string;
}

export const Markdown: FC<MarkdownProps> = ({text}) => {
    return (<div dangerouslySetInnerHTML={{__html: md.render(text)}}/>);
}


