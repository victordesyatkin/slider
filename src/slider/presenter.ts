import bind from 'bind-decorator';

import { DefaultPropsView, Props, DefaultProps } from '../types';
import { IModel, IView, IPresenter } from './interface';

export default class Presenter implements IPresenter {
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
    this.view.subscribe('handleViewClick', this.handleViewClick);
    this.view.subscribe('handleViewMouseDown', this.handleViewMouseDown);
    this.view.subscribe('handleWindowMouseUp', this.handleWindowMouseUp);
    this.view.subscribe('handleWindowMouseMove', this.handleWindowMouseMove);
  }

  private initHandlesModel(): void {
    this.model.subscribe('setPropsForView', this.setPropsForView);
  }

  @bind
  private handleWindowMouseMove(options: {
    event: MouseEvent;
    start: number;
    length: number;
  }): void {
    this.model.publish('handleWindowMouseMove', options);
  }

  @bind
  private handleViewMouseDown(options: { index: number }): void {
    this.model.publish('handleViewMouseDown', options);
  }

  @bind
  private handleWindowMouseUp(): void {
    this.model.publish('handleWindowMouseUp');
  }

  @bind
  handleViewClick(options: {
    index: number;
    event: MouseEvent;
    value?: number;
    length: number;
    start: number;
  }): void {
    this.model.publish('handleViewClick', options);
  }

  @bind
  private setPropsForView(props: DefaultPropsView): void {
    this.view.setProps(props);
  }
}
