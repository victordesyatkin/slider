export type tProps = {
  prefixCls?: string;
  vertical?: boolean;
  reverse?: boolean;
  disabled?: boolean;
  values?: number[];
  min?: number;
  max?: number;
  classNames?: string[];
  style?: { [key: string]: string };
  mark?: tMark;
  step?: number;
  onChange?: (value: number[]) => void;
  onBeforeChange?: (value: number[]) => void;
  onAfterChange?: (value: number[]) => void;
  track?: tTrack;
  handle?: tHandle;
  startPoint?: number;
  dots?: tDot;
  rail?: tRail;
  allowCross?: boolean;
  tooltip?: tTooltip;
  pushable?: number;
  precision?: number;
  index?: number;
  type?: string;
};

export type tDefaultProps = {
  prefixCls: string;
  vertical: boolean;
  reverse: boolean;
  disabled: boolean;
  values: number[];
  min: number;
  max: number;
  classNames?: string[];
  style?: { [key: string]: string };
  mark?: tMark;
  step?: number;
  onChange: (value: number[]) => void;
  onBeforeChange: (value: number[]) => void;
  onAfterChange: (value: number[]) => void;
  track?: tTrack;
  handle?: tHandle;
  startPoint?: number;
  dot?: tDot;
  rail?: tRail;
  allowCross: boolean;
  tooltip?: tTooltip;
  pushable?: number;
  precision: number;
  type: string;
};

export type tAddition = {
  index: number;
  handlers?: { [key: string]: tHandler };
  value?: number;
};

export type tHandler = (i: number, e: any) => void;

export type tHandle = {
  className?: string[];
  styles: { [key: string]: string };
};

export type tTrack = {
  classNames?: string[];
  styles?: { [key: string]: string }[];
  on?: boolean;
};

export type tRail = {
  classNames?: string[];
  styles?: { [key: string]: string }[];
  on?: boolean;
};

export type tDot = {
  wrapClassName?: string;
  className?: string;
  style?: { [key: string]: string };
  on?: boolean;
};

export type tTooltip = {
  className?: string;
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
  allways?: boolean;
};

export type tMark = {
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

export type tpbcallback = (data: any) => void;
