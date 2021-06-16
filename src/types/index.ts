type Props = Partial<{
  prefixClassName: string;
  isVertical: boolean;
  isReverse: boolean;
  isDisabled: boolean;
  isFocused: boolean;
  values: number[];
  min: number;
  max: number;
  classNames: string[] | null;
  style: Style | null;
  mark: Mark;
  dot: Dot;
  step: number;
  onChange: ((value: number[]) => void) | null;
  onBeforeChange: null | ((value: number[]) => void) | null;
  onAfterChange: ((value: number[]) => void) | null;
  track: Track;
  handle: Handle;
  rail: Rail;
  tooltip: Tooltip;
  indent: number;
  precision: number;
  index: number;
}>;

type DefaultProps = {
  prefixClassName: string;
  isVertical: boolean;
  isReverse: boolean;
  isDisabled: boolean;
  values: number[];
  min: number;
  max: number;
  step: number;
  indent: number;
  precision: number;
} & Props;

type KeyDefaultProps = keyof DefaultProps;
type KeyProps = keyof Props;

type Addition = {
  index: number;
  handles?: { [key: string]: Handler };
  value?: number;
  active?: boolean;
};

type Handler = (index: number, event: JQuery.Event, value?: number) => void;

type Handle = Partial<{
  classNames: string[] | null;
  styles: Style[] | null;
}>;

type Track = Partial<{
  classNames: string[] | null;
  styles: Style[] | null;
  isOn: boolean;
}>;

type Rail = Partial<{
  className: string | null;
  style: Style | null;
  isOn: boolean;
}>;

type Dot = Partial<{
  wrapClassName: string | null;
  className: string | null;
  style: Style | null;
  isOn: boolean;
}>;

type Tooltip = Partial<{
  className: string | null;
  style: Style | null;
  render: Render | null;
  isOn: boolean;
  isAlways: boolean;
}>;

type Mark = Partial<{
  wrapClassName: string | null;
  className: string | null;
  style: Style | null;
  render: Render | null;
  values: number[] | null;
  isOn: boolean;
  withDot: boolean;
}>;

type Callback = (data: any) => void;

type Style = { [key: string]: string };

type Render = (
  value: number
) =>
  | string
  | JQuery<HTMLElement>
  | JQuery<HTMLElement>[]
  | HTMLElement
  | HTMLElement[]
  | undefined;

export {
  Callback,
  Mark,
  Tooltip,
  Rail,
  Dot,
  Track,
  Handle,
  Handler,
  Addition,
  KeyDefaultProps,
  DefaultProps,
  Props,
  Style,
  Render,
  KeyProps,
};
