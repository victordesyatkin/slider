import jQuery from 'jquery';

import { Props } from './types';
import { Slider, createSlider } from './slider/index';
import './style.scss';

(function makeSlider($: JQueryStatic) {
  // eslint-disable-next-line no-param-reassign
  $.fn.slider = function makeCreateSlider(props?: Props): JQuery {
    return createSlider(this, props);
  };
})(jQuery);

export default Slider;
