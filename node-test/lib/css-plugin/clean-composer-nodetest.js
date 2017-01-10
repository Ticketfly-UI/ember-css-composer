const { transform, getExpectedResult } = require('../../helpers/clean-compose-css-file');
const should = require('should');

describe('css plugin', function() {
  it('works with a single file', function() {
    // Make sure it strips out any @compose declarations. 
    return transform('test-1').then((result) => {
      let expected = getExpectedResult('test-1');
      assertKeys(expected, result);
    });
  });

  it('works with multiple files', function() {
    // Make sure it strips out any @compose declarations. 
    return transform('test-2').then((result) => {
      let expected = getExpectedResult('test-2');
      assertKeys(expected, result);
    });
  });
});

function assertKeys(expectedHash, resultHash) {
  let expectedKeys = Object.keys(expectedHash);
  let resultKeys = Object.keys(resultHash);

  // Assert the same keys
  expectedKeys.should.deepEqual(resultKeys);

  // Assert each of the values are the same
  expectedKeys.forEach((key) => {
    expectedHash[key].should.equal(resultHash[key]);
  });
}
