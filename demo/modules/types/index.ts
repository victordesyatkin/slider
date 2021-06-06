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

type ItemProps = {
  value: number;
  type: string;
  data: DataProps;
} | null;

type SectionProps = Partial<{
  caption: CaptionProps;
  buttonAdd: SectionButtonProps;
  buttonRemove: SectionButtonProps;
  isControl: boolean;
  data: DataProps;
  items: ItemProps[];
}> | null;

type PanelProps = Partial<{ parent: HTMLElement | null }> | null;

type ValuesProps = Partial<{ data: DataProps; items: ItemProps[] }> | null;

type ValueItemProps = Partial<{
  item: ItemProps;
  index: number;
  handleButtonRemoveClick: (index?: number) => void;
}> | null;

type InputProps = Partial<{ value: string | number }> | null;

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
};
