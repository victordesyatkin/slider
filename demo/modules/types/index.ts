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
}> | null;

type LinkProps = Partial<{
  content: string;
  href: string;
  title: string;
  target: string;
  theme: string;
}>;

type PanelProps = Partial<{ link: LinkProps; sections: SectionProps[] }> | null;

type ValuesProps = Partial<{
  data: DataProps;
  value: number[];
  type: string;
  handleButtonAddClick: () => void;
  handleButtonRemoveClick: () => void;
}> | null;

type ValueItemProps = Partial<
  {
    index: number;
    handleButtonRemoveClick: (index?: number) => void;
  } & ItemProps
> | null;

type InputProps = ItemProps | null;

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
