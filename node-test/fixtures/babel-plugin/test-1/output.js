'use strict';

import _classify from 'ember-css-composer/classify';
import Component from 'ember-component';

export default Component.extend({
  otherProp: true,
  classNames: [_classify('a-list-component'), 'foo-bar']
});