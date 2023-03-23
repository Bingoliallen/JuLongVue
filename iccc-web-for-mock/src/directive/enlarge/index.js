/**
 * Created by hecg on 2020/8/26.
 */
import Viewer from 'viewerjs';

export default {
  inserted(el, { value }) {
    if (value === 'none') return;
    new Viewer(
      el,
      value || {
        url: 'data-original'
      }
    );
  }
};
