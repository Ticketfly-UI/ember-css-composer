const broccoli = require('broccoli');
const plugin = require('../../lib/css-plugin/index');
const fs = require('fs');
const path = require('path');
const filesPath = 'node-test/fixtures/css-plugin';
const outputFile = 'some/file/tmp.js';

module.exports = {
  transform(treePath) {
    let tree = plugin(`${filesPath}/${treePath}/input`, { outputFile });
    let builder = new broccoli.Builder(tree);

    return builder.build().then(() => {
      let jsPath = path.join(builder.outputPath, outputFile);
      return fs.readFileSync(jsPath, 'utf8');
    });
  },
  getExpectedResult(path) {
    let fullPath = `${filesPath}/${path}/output`;
    return fs.readFileSync(`${fullPath}.js`, 'utf8');
  }
}