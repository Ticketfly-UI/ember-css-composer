const babel = require('babel-core');
const plugin = require('../../lib/babel-plugin/index');
const filesPath = 'node-test/fixtures/babel-plugin';
const fs = require('fs');

module.exports = {
  transform(path) {
    let file = `${filesPath}/${path}/input.js`;

    let result = babel.transformFileSync(file, {
      plugins: [
        [plugin({ types: babel.types })]
      ]
    });

    return result.code;
  },
  getExpectedResult(path) {
    let file = `${filesPath}/${path}/output.js`;
    return fs.readFileSync(file, { encoding: 'utf8' });
  }
}