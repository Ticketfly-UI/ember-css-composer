const { transform, getExpectedResult } = require('../../helpers/transform-babel-file');
const should = require('should');

describe('babel plugin', function() {
  describe('`classNames` transform', function() {
    it('Generic Use Case works', function() {
      let transformed = transform('test-1');
      transformed.should.equal(getExpectedResult('test-1'));
    });

    it('Generated Import does not conflict with local names', function() {
      let transformed = transform('test-2');
      transformed.should.equal(getExpectedResult('test-2'));
    });

    it('It uses existing import if already present', function() {
      let transformed = transform('test-3');
      transformed.should.equal(getExpectedResult('test-3'));
    });
  });

  describe('`classNameBindings` transform', function() {
    it('Generic Use Case works', function() {
      let transformed = transform('test-4');
      transformed.should.equal(getExpectedResult('test-4'));
    });

    it('Edge cases work correctly', function() {
      let transformed = transform('test-5');
      transformed.should.equal(getExpectedResult('test-5'));
    });
  });
});