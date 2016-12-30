'use strict';

import _classifyMacro from 'ember-css-composer/classify-macro';
import _classify from 'ember-css-composer/classify';
import Component from 'ember-component';

export default Component.extend({
  otherProp: true,
  testVal: false,
  classNameBindings: ['_classifyMacro2', '_testVal', 'otherProp:foo:bar'],
  _testVal: _classifyMacro('testVal', 'hello', _classify('goodbye')),
  _classifyMacro2: _classifyMacro('', _classify('foo'), '')
});