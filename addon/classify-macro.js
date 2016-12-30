import computed from 'ember-computed';
import get from 'ember-metal/get';

export default function classifyMacro(key, ifFalsey, ifTruthy) {
  return computed(key, {
    get() {
      return get(this, key) ? ifFalsey : ifTruthy;
    }
  }).readOnly();
}