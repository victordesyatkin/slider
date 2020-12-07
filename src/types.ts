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
};

export type tHandle = {
  classNames?: string[];
  styles: { [key: string]: string }[];
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
  classNames?: string[];
  styles?: { [key: string]: string }[];
  on?: boolean;
};

export type tTooltip = {
  classNames?: string[];
  styles?: { [key: string]: string }[];
  render?: (value: number) => string;
  on?: boolean;
  precision?: number;
  allways?: boolean;
};

export type tMark = {
  classNames?: string[];
  styles?: { [key: string]: string }[];
  render?: (value: number) => string;
  values?: number[];
  on?: boolean;
  dots?: boolean;
  step?: number;
};

export type tpbcallback = (data: any) => void;
