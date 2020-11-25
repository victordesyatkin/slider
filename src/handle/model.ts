import { IHandleModel, IHandleProps, IHandlePropsModel } from "./interface";

export default class HandleModel implements IHandleModel {
  private props: IHandlePropsModel;

  constructor(props: IHandlePropsModel) {
    this.props = props;
  }

  getProps(): IHandlePropsModel {
    return this.props;
  }

  setProps(props: IHandlePropsModel) {
    return (this.props = props);
  }

  get clasName(): string {
    return this.props.className;
  }

  set clasName(clasName: string) {
    this.props.className = clasName;
  }

  get elStyle() {
    return this.props.elStyle;
  }

  set elStyle(elStyle: { [key: string]: string }) {
    this.props.elStyle = elStyle;
  }

  get handleBlur() {
    return this.props.handleBlur;
  }

  set handleBlur(handleBlur: () => void) {
    this.props.handleBlur = handleBlur;
  }

  get handleKeyDown() {
    return this.props.handleKeyDown;
  }

  set handleKeyDown(handleKeyDown: () => void) {
    this.props.handleBlur = handleKeyDown;
  }

  get handleMouseDown() {
    return this.props.handleKeyDown;
  }

  set handleMouseDown(handleMouseDown: () => void) {
    this.props.handleBlur = handleMouseDown;
  }
}
