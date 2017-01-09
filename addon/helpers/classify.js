import Ember from 'ember';
import lookupClasses from '../utils/lookup-classes';

export function classify(toTransform) {
  return toTransform.map((key) => {
    return lookupClasses(key).join(' ');
  }).join(' ');
}

export default Ember.Helper.helper(classify);
