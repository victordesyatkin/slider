type Props = {
  prefixCls?: string;
  vertical?: boolean;
  reverse?: boolean;
  disabled?: boolean;
  values?: number[];
  min?: number;
  max?: number;
  classNames?: string[];
  style?: { [key: string]: string };
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
  style?: { [key: string]: string };
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

type Addition = {
  index: number;
  handlers?: { [key: string]: Handler };
  value?: number;
  active?: boolean;
};

type Handler = (i: number, e: any, value?: number) => void;

type Handle = {
  classNames?: string[];
  styles: { [key: string]: string }[];
};

type Track = {
  classNames?: string[];
  styles?: { [key: string]: string }[];
  on?: boolean;
};

type Rail = {
  className?: string;
  style?: { [key: string]: string };
  on?: boolean;
};

type Dot = {
  wrapClassName?: string;
  className?: string;
  style?: { [key: string]: string };
  on?: boolean;
};

type Tooltip = {
  className?: string[];
  style?: { [key: string]: string };
  render?: (
    value: number
  ) =>
    | string
    | JQuery<HTMLElement>
    | JQuery<HTMLElement>[]
    | HTMLElement
    | HTMLElement[]
    | undefined;
  on?: boolean;
  precision?: number;
  always?: boolean;
};

type Mark = {
  wrapClassName?: string;
  className?: string;
  style?: { [key: string]: string };
  render?:
    | string
    | JQuery<HTMLElement>
    | JQuery<HTMLElement>[]
    | HTMLElement
    | HTMLElement[]
    | undefined;
  values?: number[];
  on?: boolean;
  dot?: boolean;
};

type Callback = (data: any) => void;

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
};
