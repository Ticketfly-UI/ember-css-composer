import _classifyMacro from 'ember-css-composer/classify-macro';
import _classify from 'ember-css-composer/classify';
import Component from 'ember-component';

export default Component.extend({
  otherProp: true,
  testVal: false,
  classNameBindings: ['_otherProp$testVal$cl', '_otherProp$testVal$cl2', 'otherProp:foo:bar'],
  _otherProp$testVal$cl2: _classifyMacro('testVal', 'hello', _classify('goodbye')),
  _otherProp$testVal$cl: _classifyMacro('', _classify('foo'), '')
});