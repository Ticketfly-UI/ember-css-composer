const broccoli = require('broccoli');
const plugin = require('../../lib/css-plugin/clean-composer');
const fs = require('fs');
const path = require('path');
const filesPath = 'node-test/fixtures/css-clean-plugin';
const outputFile = 'some/file/tmp.js';

module.exports = {
  transform(treePath) {
    let tree = plugin(`${filesPath}/${treePath}/input`, { outputFile });
    let builder = new broccoli.Builder(tree);

    return builder.build().then(() => {
      return filesMap(builder.outputPath);
    });
  },
  getExpectedResult(path) {
    let fullPath = `${filesPath}/${path}/output`;
    return filesMap(fullPath);
  }
}

function filesMap(folder) {
  return fs.readdirSync(folder).reduce((hash, file) => {
    hash[file] = fs.readFileSync(path.join(folder, file), 'utf8');
    return hash;
  }, {});
}
