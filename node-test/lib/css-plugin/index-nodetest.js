const { transform, getExpectedResult } = require('../../helpers/transform-css-tree');
const should = require('should');

describe('css plugin', function() {
  it('works!', function() {
    return transform('test-1').then((result) => {
      let expected = getExpectedResult('test-1');
      result.should.equal(expected);
    });
  });

  it('works with multiple config files', function() {
    return transform('test-2').then((result) => {
      let expected = getExpectedResult('test-2');
      result.should.equal(expected);
    });
  });
});
