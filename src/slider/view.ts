import $ from 'jquery';
import bind from 'bind-decorator';
import classnames from 'classnames';
import get from 'lodash/get';

import {
  objectToString,
  getCount,
  getSliderStart,
  getSliderLength,
} from '../helpers/utils';
import PubSub from '../helpers/pubsub';
import RailView from '../components/rail/view';
import HandleView from '../components/handle/view';
import TrackView from '../components/track/view';
import DotsView from '../components/dots/view';
import MarksView from '../components/marks/view';
import { DefaultPropsView, Addition } from '../types';
import { IView, ISubView } from './interface';

class View extends PubSub implements IView {
  private props?: DefaultPropsView;

  private view?: JQuery<HTMLElement>;

  private rails: ISubView[] = [];

  private tracks: ISubView[] = [];

  private handles: ISubView[] = [];

  private dots: ISubView[] = [];

  private marks: ISubView[] = [];

  private parent?: JQuery<HTMLElement>;

  private isRendered = false;

  public setProps(props: DefaultPropsView): void {
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
      this.view = undefined;
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
    const { prefixCls = '', mark, disabled, vertical, classNames } =
      this.props || {};
    return classnames(prefixCls, {
      [`${prefixCls}_with-mark`]: mark?.on,
      [`${prefixCls}_disabled`]: disabled,
      [`${prefixCls}_vertical`]: vertical,
      classNames,
    });
  }

  private prepareStyle(): string {
    return objectToString({ ...get(this.props, ['style']) });
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
  private handleViewClick(index: number, event: JQuery.Event): void {
    $(window).off({ mouseup: this.handleWindowMouseUpForHandleFocusout });
    $(window).on({ mouseup: this.handleWindowMouseUpForHandleFocusout });
    const { clientY: coordinateY = 0, pageX: coordinateX = 0 } = event || {};
    this.publish('onChange', {
      coordinateX,
      coordinateY,
      start: getSliderStart({ props: this.props, view: this.view }),
      length: getSliderLength({ props: this.props, view: this.view }),
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
    $(window).on({ mouseup: this.handleWindowMouseUpForHandleFocusout });
    this.publish('onAfterChange');
  }

  @bind
  private handleWindowMouseMove(event: MouseEvent): void {
    const { clientY: coordinateY = 0, pageX: coordinateX = 0 } = event || {};
    this.publish('onChange', {
      coordinateX,
      coordinateY,
      start: getSliderStart({ props: this.props, view: this.view }),
      length: getSliderLength({ props: this.props, view: this.view }),
    });
  }

  private createOrUpdateSubViews(): void {
    const count = getCount(this.props);
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
      const { index: readyIndex } = this.props;
      if (action === 'mousedown') {
        handles = {
          handleViewMouseDown: this.handleViewMouseDown,
        };
      } else if (action === 'click') {
        if (getCount(this.props) > 0) {
          handles = {
            handleViewClick: this.handleViewClick,
          };
        }
      }
      for (let index = 0; index < count; index += 1) {
        if (withActive) {
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
