import $ from 'jquery';

import TrackView from '../../View/TrackView';
import {
  setFunctionGetBoundingClientRectHTMLElement,
  defaultProps,
} from '../../helpers/utils';

describe('rail', () => {
  describe('view', () => {
    test('create track view', () => {
      const addition = { index: 0 };
      const view = new TrackView(addition);
      expect(view).toBeInstanceOf(TrackView);

      expect(view).toEqual(
        expect.objectContaining({
          setProps: expect.any(Function),
          render: expect.any(Function),
          remove: expect.any(Function),
        })
      );
    });

    test('render track view', () => {
      setFunctionGetBoundingClientRectHTMLElement();
      $('body').append('<div class="slider__wrapper"/>');
      const addition = { index: 0 };
      const view = new TrackView(addition);
      const $parent = $('.slider__wrapper');
      view.render($parent);
      let $element = $(`.${defaultProps.prefixClassName}__track`, $parent);
      expect($element.length).toBe(0);

      view.setProps(defaultProps);
      $element = $(`.${defaultProps.prefixClassName}__track`, $parent);
      expect($element.length).toBe(1);

      view.setProps({ ...defaultProps, track: { isOn: false } });
      $element = $(`.${defaultProps.prefixClassName}__track`, $parent);
      expect($element.length).toBe(0);
    });
  });
});
