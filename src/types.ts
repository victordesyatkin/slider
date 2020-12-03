export type tProps = {
  prefixCls?: string;
  vertical?: boolean;
  reverse?: boolean;
  disabled?: boolean;
  value?: number[];
  defaultValue?: number[];
  min?: number;
  max?: number;
  classNames?: string[];
  mark?: tMark;
  step?: number;
  onChange?: (value: number[]) => void;
  onBeforeChange?: (value: number[]) => void;
  onAfterChange?: (value: number[]) => void;
  trackStyle?: ({ [key: string]: string } | undefined)[];
  handleStyle?: ({ [key: string]: string } | undefined)[];
  tabIndex?: number[];
  startPoint?: number;
  dots?: boolean;
  dotStyle?: { [key: string]: string };
  railStyle?: { [key: string]: string };
  allowCross?: boolean;
  tooltip?: tTooltip;
  pushable?: number | boolean;
  precision?: number;
};

export type tDefaultProps = {
  prefixCls: string;
  vertical: boolean;
  reverse: boolean;
  disabled: boolean;
  value?: number[];
  defaultValue: number[];
  min: number;
  max: number;
  classNames: string[];
  mark?: tMark;
  step?: number;
  onChange: (value: number[]) => void;
  onBeforeChange: (value: number[]) => void;
  onAfterChange: (value: number[]) => void;
  trackStyle?: ({ [key: string]: string } | undefined)[];
  handleStyle?: ({ [key: string]: string } | undefined)[];
  tabIndex: number[];
  startPoint?: number;
  dots: boolean;
  dotStyle?: { [key: string]: string };
  railStyle?: { [key: string]: string };
  allowCross: boolean;
  tooltip?: tTooltip;
  pushable: number | boolean;
  precision: number;
};

export type tTooltip = {
  classNames?: string[];
  style?: { [key: string]: string };
  render?: (value: number) => string;
  active?: boolean;
  precision?: number;
  show?: boolean;
};

export type tMark = {
  classNames?: string[];
  style?: { [key: string]: string };
  render?: (value: number) => string;
  values?: number[];
  show?: boolean;
  dots?: boolean;
  step?: number;
};
