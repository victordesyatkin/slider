type ComponentProps = Partial<{
  parent: HTMLElement | JQuery<HTMLElement> | null;
  props: unknown;
  className: string;
  query: string;
}> | null;

type ButtonProps = Partial<{
  handleButtonClick: ((event: JQuery.Event) => void) | null;
}> | null;

type SectionButtonProps = {
  type: 'button' | 'submit';
  content?: string;
  title?: string;
} | null;

type CaptionProps = Partial<{
  content: string;
  theme: string;
}>;

type DataProps = Partial<{
  type: string;
  property: string;
}> | null;

type ItemProps = Partial<{
  value: number | string | number[] | string[];
  type: string;
  data: DataProps;
}> | null;

type SectionProps = Partial<{
  caption: CaptionProps;
  buttonAdd: SectionButtonProps;
  buttonRemove: SectionButtonProps;
  isControl: boolean;
  data: DataProps;
  items: ItemProps[];
  handleInputFocusout: () => void;
}> | null;

type LinkProps = Partial<{
  content: string;
  href: string;
  title: string;
  target: string;
  theme: string;
}>;

type PanelProps = Partial<{
  link: LinkProps;
  sections: SectionProps[];
  handleInputFocusout: () => void;
}> | null;

type ValuesProps = Partial<{
  data: DataProps;
  value: number[];
  type: string;
  handleButtonAddClick: () => void;
  handleButtonRemoveClick: () => void;
  handleInputFocusout: () => void;
}> | null;

type ValueItemProps = Partial<
  {
    index: number;
    handleInputFocusout: () => void;
    handleButtonRemoveClick: (index?: number) => void;
    handleInputInput: (
      options?: Partial<{ index: number; value: string }>
    ) => void;
  } & ItemProps
> | null;

type InputProps =
  | (Partial<{
      handleInputInput: (value: string) => void;
      handleInputFocusout: () => void;
    }> &
      ItemProps)
  | null;

type ExampleProps = Partial<{
  caption: CaptionProps;
  panel: PanelProps;
}> | null;

export {
  ComponentProps,
  ButtonProps,
  PanelProps,
  CaptionProps,
  ItemProps,
  SectionProps,
  ValuesProps,
  ValueItemProps,
  InputProps,
  DataProps,
  ExampleProps,
};
