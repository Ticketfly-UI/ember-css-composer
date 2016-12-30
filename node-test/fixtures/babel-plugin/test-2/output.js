import _classify2 from 'ember-css-composer/classify';
import Component from 'ember-component';
let _classify = true;

export default Component.extend({
  otherProp: true,
  classNames: [_classify2('a-list-component'), 'foo-bar']
});