
import { classify } from 'dummy/helpers/classify';
import { module, test } from 'qunit';

module('Unit | Helper | classify');

test('it works', function(assert) {
  let result = classify(['testing-basic', 'testing-basic__open']);
  assert.equal(result, 'tb-1 tb-2 tb-3 tb-4');
});

