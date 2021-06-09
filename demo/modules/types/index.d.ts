/// <reference types="jquery" />
declare type ComponentProps = Partial<{
    parent: HTMLElement | JQuery<HTMLElement> | null;
    props: unknown;
    className: string;
    query: string;
}> | null;
declare type ButtonProps = Partial<{
    handleButtonClick: ((event: JQuery.Event) => void) | null;
}> | null;
declare type SectionButtonProps = {
    type: 'button' | 'submit';
    content?: string;
    title?: string;
} | null;
declare type CaptionProps = Partial<{
    content: string;
    theme: string;
}>;
declare type DataProps = Partial<{
    type: string;
    property: string;
}> | null;
declare type ItemProps = Partial<{
    value: number | string | number[] | string[];
    type: string;
    data: DataProps;
}> | null;
declare type SectionProps = Partial<{
    caption: CaptionProps;
    buttonAdd: SectionButtonProps;
    buttonRemove: SectionButtonProps;
    isControl: boolean;
    data: DataProps;
    items: ItemProps[];
    handleInputFocusout: () => void;
}> | null;
declare type LinkProps = Partial<{
    content: string;
    href: string;
    title: string;
    target: string;
    theme: string;
}>;
declare type PanelProps = Partial<{
    link: LinkProps;
    sections: SectionProps[];
    handleInputFocusout: () => void;
}> | null;
declare type ValuesProps = Partial<{
    data: DataProps;
    value: number[];
    type: string;
    handleButtonAddClick: () => void;
    handleButtonRemoveClick: () => void;
    handleInputFocusout: () => void;
}> | null;
declare type ValueItemProps = Partial<{
    index: number;
    handleInputFocusout: () => void;
    handleButtonRemoveClick: (index?: number) => void;
    handleInputInput: (options?: Partial<{
        index: number;
        value: string;
    }>) => void;
} & ItemProps> | null;
declare type InputProps = (Partial<{
    handleInputInput: (value: string) => void;
    handleInputFocusout: () => void;
}> & ItemProps) | null;
declare type ExampleProps = Partial<{
    caption: CaptionProps;
    panel: PanelProps;
}> | null;
export { ComponentProps, ButtonProps, PanelProps, CaptionProps, ItemProps, SectionProps, ValuesProps, ValueItemProps, InputProps, DataProps, ExampleProps, };
