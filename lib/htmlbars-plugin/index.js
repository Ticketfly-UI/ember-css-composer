function ClassMacroTransform() {
  this.syntax = null;
}

ClassMacroTransform.prototype.transform = function (ast) {
  if (!this.builders) {
    this.builders = this.syntax.builders;
    this.isGlimmer = this.detectGlimmer();
  }

  this.syntax.traverse(ast, {
    BlockStatement: this.transformStatement.bind(this),
    ElementNode: this.transformElementNode.bind(this)
  });

  return ast;
};

ClassMacroTransform.prototype.detectGlimmer = function() {
  if (!this.syntax.parse) { return false; }

  // HTMLBars builds ConcatStatements with StringLiterals + raw PathExpressions
  // Glimmer builds ConcatStatements with TextNodes + MustacheStatements
  var ast = this.syntax.parse('<div class="foo {{bar}}"></div>');
  return ast.body[0].attributes[0].value.parts[0].type === 'TextNode';
};

ClassMacroTransform.prototype.transformElementNode = function(node) {
  let classAttr = getAttr(node, 'class');

  // If there is no class name applied, do nothing.
  if (!classAttr) { 
    return node; 
  }

  this.transformClassDeclaration(classAttr);
};

ClassMacroTransform.prototype.transformStatement = function(node) {
  let classAttr = getPair(node, 'class');
  
  // If there is no class name applied, do nothing.
  if (!classAttr) { 
    return node; 
  }

  this.transformClassDeclaration(classAttr);
};

ClassMacroTransform.prototype.transformClassDeclaration = function(node) {
  // Traverse from the classAttr to see if there are any text/string nodes with
  // an @ symbol. We'll replace each of those with a sub expression. 
  this.syntax.traverse(node, {
    TextNode: this.transformTextClass.bind(this),
    StringLiteral: this.transformTextClass.bind(this)
  });
};

ClassMacroTransform.prototype.transformTextClass = function(node) {
  let isTextNode = node.type === 'TextNode';
  let makeSubExp = !isTextNode;
  let chars = isTextNode ? node.chars : node.value;

  // If there is no "@" we can skip.
  if (chars.indexOf('@') === -1) {
    return node;
  }

  let parts = [];
  let nonTransformed = [];
  let transformed = [];

  chars.split(' ').forEach((className) => {
    if (className.charAt(0) === '@') {
      transformed.push(this.builders.string(className.slice(1)));
    } else {
      nonTransformed.push(className);
    }
  });

  if (transformed.length) {
    let buildType = makeSubExp ? 'sexpr' : 'mustache';
    let path = this.builders.path('classify');
    parts.push(this.builders[buildType](path, transformed));
  }

  // If there are other classNames
  if (nonTransformed.length) {
    parts.push(this.makeString(' ' + nonTransformed.join(' '), makeSubExp));
  }

  // Return a concat expression.
  if (makeSubExp) {
    return this.builders.sexpr(this.builders.path('concat'), parts);
  } else {
    return this.builders.concat(parts);
  }
};

ClassMacroTransform.prototype.makeString = function(chars, isSubExp) {
  let stringBuilder = this.isGlimmer && !isSubExp ? 'text' : 'string';
  return this.builders[stringBuilder](chars);
};

function getAttr(node, path) {
  return findBy(node.attributes, 'name', path);
}

function getPair(node, path) {
  return findBy(node.hash.pairs, 'key', path);
}

function findBy(target, key, path) {
  for (var i = 0, l = target.length; i < l; i++) {
    if (target[i][key] === path) {
      return target[i];
    }
  }

  return false;
}

module.exports = ClassMacroTransform;