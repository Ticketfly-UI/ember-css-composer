import Component from 'ember-component';

export default Component.extend({
  otherProp: true,
  testVal: false,
  classNameBindings: [':@foo', 'testVal:hello:@goodbye', 'otherProp:foo:bar']
});