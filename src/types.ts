type Props = {
  prefixCls?: string;
  vertical?: boolean;
  reverse?: boolean;
  disabled?: boolean;
  values?: number[];
  min?: number;
  max?: number;
  classNames?: string[];
  style?: style;
  mark?: Mark;
  dot?: Dot;
  step?: number;
  onChange?: (value: number[]) => void;
  onBeforeChange?: (value: number[]) => void;
  onAfterChange?: (value: number[]) => void;
  track?: Track;
  handle?: Handle;
  startPoint?: number;
  rail?: Rail;
  allowCross?: boolean;
  tooltip?: Tooltip;
  push?: number;
  precision?: number;
  index?: number;
};

type DefaultProps = {
  prefixCls: string;
  vertical: boolean;
  reverse: boolean;
  disabled: boolean;
  values: number[];
  min: number;
  max: number;
  classNames?: string[];
  style?: style;
  mark?: Mark;
  step?: number;
  onChange?: (value: number[]) => void;
  onBeforeChange?: (value: number[]) => void;
  onAfterChange?: (value: number[]) => void;
  track?: Track;
  handle?: Handle;
  dot?: Dot;
  rail?: Rail;
  startPoint?: number;
  allowCross: boolean;
  tooltip?: Tooltip;
  push?: number;
  precision: number;
};

type KeyDefaultProps = keyof DefaultProps;
type KeyProps = keyof Props;

type Addition = {
  index: number;
  handlers?: { [key: string]: Handler };
  value?: number;
  active?: boolean;
};

type Handler = (i: number, e: any, value?: number) => void;

type Handle = {
  classNames?: string[];
  styles: style[];
};

type Track = {
  classNames?: string[];
  styles?: style[];
  on?: boolean;
};

type Rail = {
  className?: string;
  style?: style;
  on?: boolean;
};

type Dot = {
  wrapClassName?: string;
  className?: string;
  style?: style;
  on?: boolean;
};

type Tooltip = {
  className?: string[];
  style?: style;
  render?: render;
  on?: boolean;
  always?: boolean;
};

type Mark = {
  wrapClassName?: string;
  className?: string;
  style?: style;
  render?: render;

  values?: number[];
  on?: boolean;
  dot?: boolean;
};

type Callback = (data: any) => void;

type style = { [key: string]: string };

type render = (
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
  style,
  render,
  KeyProps,
};
