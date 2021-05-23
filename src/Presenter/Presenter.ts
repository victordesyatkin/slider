import bind from 'bind-decorator';

import { prepareData } from '../helpers/utils';
import { DefaultProps, Props } from '../types';
import { IModel, IView, IPresenter } from '../interfaces';
import Model from '../Model';
import View from '../View';

class Presenter implements IPresenter {
  private model: IModel;

  private view: IView;

  constructor(element: JQuery<HTMLElement>, props?: Props) {
    this.model = new Model(prepareData(props));
    this.view = new View();
    this.view.render(element);
    this.view.setProps(this.getProps());
    this.initHandlesView();
    this.initHandlesModel();
  }

  public getProps(): DefaultProps {
    return this.model.getProps();
  }

  public setProps(props?: Props): void {
    // console.log('Presenter setProps : ');
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
  private setPropsForView(props: DefaultProps): void {
    this.view.setProps(props);
  }

  @bind
  private setIndex(options: { index?: number }): void {
    this.model.setIndex(options);
  }
}

export default Presenter;
