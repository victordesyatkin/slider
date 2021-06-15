import $ from 'jquery';
import bind from 'bind-decorator';
import classnames from 'classnames';

import {
  objectToString,
  getSliderStart,
  getSliderLength,
} from '../helpers/utils';
import PubSub from '../Pubsub';
import RailView from './RailView';
import HandleView from './HandleView';
import TrackView from './TrackView';
import DotsView from './DotsView';
import MarksView from './MarksView';
import { DefaultProps, Addition } from '../types';
import { IView, ISubView } from '../interfaces';

class View extends PubSub implements IView {
  private props?: DefaultProps;

  private view?: JQuery<HTMLElement> | null;

  private rails: ISubView[] = [];

  private tracks: ISubView[] = [];

  private handles: ISubView[] = [];

  private dots: ISubView[] = [];

  private marks: ISubView[] = [];

  private parent?: JQuery<HTMLElement>;

  private isRendered = false;

  public setProps(props: DefaultProps): void {
    this.props = props;
    this.updateView();
    this.createOrUpdateSubViews();
    this.appendSubViews();
    this.render();
  }

  public render(parent?: JQuery<HTMLElement>): void {
    if (parent) {
      this.parent = parent;
    }
    if (!this.isRendered) {
      if (this.parent && this.view) {
        this.parent.append(this.view);
        this.isRendered = true;
      }
    }
  }

  public remove(): void {
    if (this.view) {
      this.view.remove();
      this.view = null;
      this.isRendered = false;
    }
  }

  private static cleanSubView(views: IView[], count: number): void {
    const { length } = views;
    if (length > count) {
      for (let index = count; index < length; index += 1) {
        if (views[index]) {
          views[index].remove();
        }
      }
      views.splice(count);
    }
  }

  private createView(): void {
    this.view = $('<div/>', this.prepareAttr());
  }

  private updateView(): void {
    if (!this.view) {
      this.createView();
    } else {
      this.view.attr(this.prepareAttr());
    }
  }

  private prepareAttr(): { class: string; style: string } {
    return {
      class: this.prepareClassName(),
      style: this.prepareStyle(),
    };
  }

  private prepareClassName(): string {
    const { prefixClassName = '', mark, isDisabled, isVertical, classNames } =
      this.props || {};
    return classnames(prefixClassName, {
      [`${prefixClassName}_with-mark`]: mark?.isOn,
      [`${prefixClassName}_disabled`]: isDisabled,
      [`${prefixClassName}_vertical`]: isVertical,
      classNames,
    });
  }

  private prepareStyle(): string {
    return objectToString({ ...this.props?.style });
  }

  @bind
  private handleWindowMouseUpForHandleFocusout(event: MouseEvent): void {
    const { target } = event;
    if (target && this.view) {
      const $target = $(target);
      if (!$target.closest(this.view).length) {
        this.publish('setIndex', { index: -1 });
        $(window).off({
          mouseup: this.handleWindowMouseUpForHandleFocusout,
        });
      }
    }
  }

  @bind
  private handleViewClick(_: number, event: JQuery.Event): void {
    $(window).off({ mouseup: this.handleWindowMouseUpForHandleFocusout });
    if (this.props?.isFocused) {
      $(window).on({ mouseup: this.handleWindowMouseUpForHandleFocusout });
    }
    const { clientY: coordinateY = 0, pageX: coordinateX = 0 } = event || {};
    if (!this.props?.isFocused) {
      this.publish('setIndex', { index: -1 });
    }
    const { isVertical, isReverse } = this.props || {};
    this.publish('onChange', {
      coordinateX,
      coordinateY,
      start: getSliderStart({ isReverse, isVertical, view: this.view }),
      length: getSliderLength({ isVertical, view: this.view }),
      action: 'onAfterChange',
    });
  }

  @bind
  private handleViewMouseDown(index: number): void {
    $(window).on({ mousemove: this.handleWindowMouseMove });
    $(window).on({ mouseup: this.handleWindowMouseUp });
    $(window).off({ mouseup: this.handleWindowMouseUpForHandleFocusout });
    this.publish('onBeforeChange', { index });
  }

  @bind
  private handleWindowMouseUp(): void {
    $(window).off({ mousemove: this.handleWindowMouseMove });
    $(window).off({ mouseup: this.handleWindowMouseUp });
    if (this.props?.isFocused) {
      $(window).on({ mouseup: this.handleWindowMouseUpForHandleFocusout });
    } else {
      this.publish('setIndex', { index: -1 });
    }
    this.publish('onAfterChange');
  }

  @bind
  private handleWindowMouseMove(event: MouseEvent): void {
    const { isVertical, isReverse } = this.props || {};
    const { clientY: coordinateY = 0, pageX: coordinateX = 0 } = event || {};
    this.publish('onChange', {
      coordinateX,
      coordinateY,
      start: getSliderStart({ isReverse, isVertical, view: this.view }),
      length: getSliderLength({ isVertical, view: this.view }),
    });
  }

  private createOrUpdateSubViews(): void {
    const { values = [] } = this.props || {};
    const count = (values || []).length;
    this.rails = this.createOrUpdateSubView<RailView>(
      this.rails,
      1,
      RailView,
      'click'
    );
    this.tracks = this.createOrUpdateSubView<TrackView>(
      this.tracks,
      count - 1 || 1,
      TrackView
    );
    this.dots = this.createOrUpdateSubView<DotsView>(
      this.dots,
      1,
      DotsView,
      'click'
    );
    this.marks = this.createOrUpdateSubView<MarksView>(
      this.marks,
      1,
      MarksView,
      'click'
    );
    this.handles = this.createOrUpdateSubView<HandleView>(
      this.handles,
      count,
      HandleView,
      'mousedown',
      true
    );
  }

  private createOrUpdateSubView<T extends ISubView>(
    views: ISubView[],
    count: number,
    SubView: { new (addition: Addition): T },
    action?: string,
    withActive?: boolean
  ): ISubView[] {
    const readyViews = [...views];
    if (this.props) {
      let handles;
      let active;
      const { index: readyIndex, isFocused } = this.props;
      if (action === 'mousedown') {
        handles = {
          handleViewMouseDown: this.handleViewMouseDown,
        };
      } else if (action === 'click') {
        const { values = [] } = this.props;
        const valuesLength = (values || []).length;
        if (valuesLength > 0) {
          handles = {
            handleViewClick: this.handleViewClick,
          };
        }
      }
      for (let index = 0; index < count; index += 1) {
        if (withActive && isFocused) {
          active = index === readyIndex;
        }
        if (readyViews[index]) {
          let addition = readyViews[index].getAddition();
          addition = { ...addition, handles, active };
          readyViews[index].setAddition(addition);
          readyViews[index].setProps(this.props);
        } else {
          readyViews[index] = new SubView({ index, handles, active });
          readyViews[index].setProps(this.props);
        }
      }
      View.cleanSubView(readyViews, count);
    }
    return readyViews;
  }

  private appendSubViews(): void {
    if (this.view) {
      this.rails.forEach(this.appendSubView);
      this.marks.forEach(this.appendSubView);
      this.dots.forEach(this.appendSubView);
      this.tracks.forEach(this.appendSubView);
      this.handles.forEach(this.appendSubView);
    }
  }

  @bind
  private appendSubView(subView: IView): void {
    if (this.view) {
      subView.render(this.view);
    }
  }
}

export default View;
