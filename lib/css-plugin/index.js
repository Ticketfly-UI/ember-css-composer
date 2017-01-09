const postcss = require('postcss');
const concat = require('broccoli-concat');
const Filter = require('broccoli-persistent-filter');

CSStoJSON.prototype = Object.create(Filter.prototype);
CSStoJSON.prototype.constructor = CSStoJSON;
CSStoJSON.prototype.extensions = ['js'];
CSStoJSON.prototype.targetExtension = 'js';

function CSStoJSON(inputTree, options = {}) {
  if (!(this instanceof CSStoJSON)) {
    return new CSStoJSON(inputTree, options);
  }

  let mergedTree = concat(inputTree, {
    outputFile: options.outputFile,
    sourceMapConfig: { enabled: false },
    allowNone: true
  });

  Filter.call(this, mergedTree, {
    annotation: options.annotation
  });
}

CSStoJSON.prototype.processString = function(content) {
  return processConfigFile(content);
};

function processConfigFile(str) {
  let result = {};
  let ast = postcss.parse(str);
  
  walkComposesDecls(ast, (dec, parentName) => {
    result[parentName] = parseValue(dec.value);
  });

  return `export default ${JSON.stringify(result)};`;
};

function walkComposesDecls(ast, cb) {
  ast.walkAtRules((node) => {
    if (node.name === 'composer') {
      node.walkAtRules((childNode) => {
        let value = childNode.walkDecls((dec) => {
          if (dec.prop === 'composes') {
            cb(dec, childNode.name);
          }
        });
      });
    }
  });
}

function parseValue(value) {
  return value.split(/,\s?/).map((className) => {
    return className.replace(/["']/g, '');
  });
}

module.exports = CSStoJSON;