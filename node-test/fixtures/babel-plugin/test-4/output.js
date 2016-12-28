import _classifyMacro from 'ember-css-composer/classify-macro';
import _classify from 'ember-css-composer/classify';
import Component from 'ember-component';

export default Component.extend({
  otherProp: true,
  classNameBindings: ['_otherProp$classNameB'],
  _otherProp$classNameB: _classifyMacro('otherProp', _classify('foo'), _classify('bar'))
});