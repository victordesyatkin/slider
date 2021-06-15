/// <reference types="jquery" />
declare type Props = Partial<{
  prefixClassName: string;
  isVertical: boolean;
  isReverse: boolean;
  isDisabled: boolean;
  isFocused: boolean;
  values: number[];
  min: number;
  max: number;
  classNames: string[];
  style: Style;
  mark: Mark;
  dot: Dot;
  step: number;
  onChange: ((value: number[]) => void) | null;
  onBeforeChange: null | ((value: number[]) => void) | null;
  onAfterChange: ((value: number[]) => void) | null;
  track: Track;
  handle: Handle;
  startPoint: number;
  rail: Rail;
  tooltip: Tooltip;
  indent: number;
  precision: number;
  index: number;
}>;
declare type DefaultProps = {
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
declare type KeyDefaultProps = keyof DefaultProps;
declare type KeyProps = keyof Props;
declare type Addition = {
  index: number;
  handles?: {
    [key: string]: Handler;
  };
  value?: number;
  active?: boolean;
};
declare type Handler = (
  index: number,
  event: JQuery.Event,
  value?: number
) => void;
declare type Handle = {
  classNames?: string[];
  styles: Style[];
};
declare type Track = Partial<{
  classNames: string[];
  styles: Style[];
  isOn: boolean;
}>;
declare type Rail = Partial<{
  className: string;
  style: Style;
  isOn: boolean;
}>;
declare type Dot = Partial<{
  wrapClassName: string;
  className: string;
  style: Style;
  isOn: boolean;
}>;
declare type Tooltip = Partial<{
  className: string[];
  style: Style;
  render: Render;
  isOn: boolean;
  always: boolean;
}>;
declare type Mark = Partial<{
  wrapClassName: string;
  className: string;
  style: Style;
  render: Render;
  values: number[];
  isOn: boolean;
  dot: boolean;
}>;
declare type Callback = (data: any) => void;
declare type Style = {
  [key: string]: string;
};
declare type Render = (
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
