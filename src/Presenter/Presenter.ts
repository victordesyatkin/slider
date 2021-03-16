import bind from 'bind-decorator';

import { DefaultPropsView, Props, DefaultProps } from '../types';
import { IModel, IView, IPresenter } from '../interfaces';

class Presenter implements IPresenter {
  private model: IModel;

  private view: IView;

  constructor(model: IModel, view: IView) {
    this.model = model;
    this.view = view;
    this.view.setProps(this.model.getProps());
    this.initHandlesView();
    this.initHandlesModel();
  }

  public getProps(): DefaultProps {
    return this.model.getProps();
  }

  public setProps(props?: Props): void {
    this.model.setProps(props);
  }

  private initHandlesView(): void {
    this.view.subscribe('onBeforeChange', this.onBeforeChange);
    this.view.subscribe('onAfterChange', this.onAfterChange);
    this.view.subscribe('onChange', this.onChange);
    this.view.subscribe('setIndex', this.setIndex);
  }

  private initHandlesModel(): void {
    this.model.subscribe('setPropsForView', this.setPropsForView);
  }

  @bind
  private onChange(options: {
    coordinateX: number;
    coordinateY: number;
    start: number;
    length: number;
  }): void {
    this.model.onChange(options);
  }

  @bind
  private onAfterChange(): void {
    this.model.onAfterChange();
  }

  @bind
  private onBeforeChange(options: { index: number }): void {
    this.model.onBeforeChange(options);
  }

  @bind
  private setPropsForView(props: DefaultPropsView): void {
    this.view.setProps(props);
  }

  @bind
  private setIndex(options: { index?: number }): void {
    this.model.setIndex(options);
  }
}

export default Presenter;
