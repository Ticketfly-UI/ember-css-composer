import Component from 'ember-component';
import doClassThing from 'ember-css-composer/classify';

export default Component.extend({
  otherProp: true,
  classNames: [doClassThing('a-list-component'), 'foo-bar']
});