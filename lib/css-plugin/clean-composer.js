const postcss = require('postcss');
const Filter = require('broccoli-persistent-filter');

CSSStripCompose.prototype = Object.create(Filter.prototype);
CSSStripCompose.prototype.constructor = CSSStripCompose;
CSSStripCompose.prototype.extensions = ['css'];
CSSStripCompose.prototype.targetExtension = 'css';

function CSSStripCompose(inputTree, options = {}) {
  if (!(this instanceof CSSStripCompose)) {
    return new CSSStripCompose(inputTree, options);
  }

  Filter.call(this, inputTree, options);
}

CSSStripCompose.prototype.processString = function(content) {
  return removeComposesDecls(content);
};

function removeComposesDecls(content) {
  let ast = postcss.parse(content);

  ast.walkAtRules((node) => {
    if (node.name === 'composer') {
      node.remove();
    }
  });

  return ast.toResult().css;
}

module.exports = CSSStripCompose;
