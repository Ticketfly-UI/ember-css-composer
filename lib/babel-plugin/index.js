const path = require('path');
const classifyImportLocation = 'ember-css-composer/classify';
const classifyMacroImportLocation = 'ember-css-composer/classify-macro';

function ClassifyPlugin(babel) {
  const { types: t, traverse } = babel;
  
  const ImportDeclarationFinder = {
    ImportDefaultSpecifier(path, parent, scope, state) {
      let importPath = parent.source.value;

      if (importPath === classifyImportLocation) {
        state.classifyIdentifier = path.local;
      } else if(importPath === classifyMacroImportLocation) {
        state.classifyMacroIdentifier = path.local;
      }
    }
  };

  const ClassNamesMacroFinder = {
    Literal(path, parent, scope, state) {
      let value = path.value;
      let parentIdentifier = state.parentIdentifier;

      if (!(typeof value === 'string') || value.charAt(0) !== '@') {
        return;
      }

      // Mark that we need the classify macro
      state.classifyImportNeeded = true;
      
      // Replace the string with the function to classify.
      this.replaceWith(classifyString(state.classifyIdentifier, value));
    }
  };

  const ClassNameBindingsMacroFinder = {
    Literal(path, parent, scope, state) {
      let value = path.value;
      let parentIdentifier = state.parentIdentifier;
      
      // If no :@ symbol, skip.
      if (!(typeof value === 'string') || value.indexOf('@') === -1) {
        return;
      }

      // Mark that we need the various classify imports.
      state.classifyMacroImportNeeded = true;
      state.classifyImportNeeded = true;

      // Get the various bits from the value.
      let [objectKey, truthy = '', falsey = ''] = value.split(':');
      
      let macroArgs = [];

      // Add the first arg as a string declaration.
      macroArgs.push(t.literal(objectKey));
      macroArgs.push(classifyString(state.classifyIdentifier, truthy));
      macroArgs.push(classifyString(state.classifyIdentifier, falsey));

      // Create a new UID key for the object.
      let macroKey = scope.generateUidIdentifierBasedOnNode(parentIdentifier.parent, objectKey || 'classifyMacro');
      
      this.replaceWith(t.literal(macroKey.name));

      // Create the new Object expression.
      let prop = t.property('object', macroKey, t.callExpression(state.classifyMacroIdentifier, macroArgs));
      state.parentIdentifierScope.insertAfter([prop]);
    }
  };
  
  return new babel.Transformer('ember-css-composer-babel-transform', {
    Property(path, parent, scope, state) {
      let attr = path.key.name;

      // Make the current property available to sub-traversal
      state.parentIdentifier = path;
      state.parentIdentifierScope = this;
      
      if (attr === 'classNames') {
        traverse(path, ClassNamesMacroFinder, scope, state);
      } else if (attr === 'classNameBindings') {
        traverse(path, ClassNameBindingsMacroFinder, scope, state);
      }

      // Remove parent Identifier from state
      delete state.parentIdentifier;
    },
    Program: {
      enter(path, parent, scope, state) {
        traverse(path, ImportDeclarationFinder, scope, state);

        if (!state.classifyIdentifier) {
          state.doesNotHaveClassifyImport = true;
          state.classifyIdentifier = scope.generateUidIdentifier('classify');
        }

        if (!state.classifyMacroIdentifier) {
          state.doesNotHaveClassifyMacroImport = true;
          state.classifyMacroIdentifier = scope.generateUidIdentifier('classifyMacro');
        }
      },
      exit(path, parent, scope, state) {
        if (state.classifyImportNeeded && state.doesNotHaveClassifyImport) {
          makeImportStatement.call(this, path, state.classifyIdentifier, classifyImportLocation);
        }

        if (state.classifyMacroImportNeeded && state.doesNotHaveClassifyMacroImport) {
          makeImportStatement.call(this, path, state.classifyMacroIdentifier, classifyMacroImportLocation);
        }
      }
    }
  });

  function classifyString(classifyIdentifier, string) {
    if (string.charAt(0) === '@') {
      return t.callExpression(classifyIdentifier, [
        t.literal(string.slice(1))
      ]);
    } else {
      return t.literal(string);
    }
  }

  function makeImportStatement(path, identifier, importPath) {
    let specifier = t.importDefaultSpecifier(identifier);
    let importsFrom = t.literal(importPath);
    let declaration = t.importDeclaration([specifier], importsFrom);
    this.unshiftContainer('body', declaration);
  }
};

// Make sure broccoli-babel-transpiler can cache this.
ClassifyPlugin.baseDir = function() {
  return path.join(__dirname, '../../');
};

ClassifyPlugin.cacheKey = function() {
  return '{}';
};

module.exports = ClassifyPlugin;