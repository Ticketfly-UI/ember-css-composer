import Component from 'ember-component';

export default Component.extend({
  otherProp: true,
  classNameBindings: ['otherProp:@foo:@bar']
});