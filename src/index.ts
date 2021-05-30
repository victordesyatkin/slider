import jQuery from 'jquery';

import { Props } from './types';
import Slider from './Slider';
import './style.scss';

(function makeSlider($: JQueryStatic) {
  $.fn.slider = function makeCreateSlider(props?: Props): JQuery {
    return Slider.createSlider(this, props);
  };
})(jQuery);

export default Slider;
