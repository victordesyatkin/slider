type ComponentProps = Partial<{
  parent: HTMLElement;
  props: unknown;
  className: string;
  query: string;
}>;

type ButtonProps = Partial<{
  parent: HTMLElement | JQuery<HTMLElement> | null;
  handleButtonClick: ((event: JQuery.Event) => void) | null;
}> | null;

type SectionButtonProps = {
  type: 'button' | 'submit';
  content?: string;
  title?: string;
};

type CaptionProps = Partial<{
  content: string;
  theme: string;
}>;

type DataProps = Partial<{
  type: string;
  property: string;
}>;

type ItemProps = {
  value: number;
  type: string;
  data: Data;
};

type SectionProps = Partial<{
  caption: CaptionProps;
  buttonAdd: SectionButtonProps;
  buttonRemove: SectionButtonProps;
  isControl: boolean;
  data: DataProps;
  items: ItemProps[];
}>;

type PanelProps = Partial<{ parent: HTMLElement | null }>;

export {
  ComponentProps,
  ButtonProps,
  PanelProps,
  Button,
  Caption,
  Item,
  Section,
};
