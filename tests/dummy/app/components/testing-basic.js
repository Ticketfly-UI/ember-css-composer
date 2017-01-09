import Ember from 'ember';
import layout from '../templates/components/testing-basic';

export default Ember.Component.extend({
  layout,
  isOpen: false,
  classNames: ['@testing-basic'],
  classNameBindings: ['isOpen:@testing-basic__open:@testing-basic__closed']
});
