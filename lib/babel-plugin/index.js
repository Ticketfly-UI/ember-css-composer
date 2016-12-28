const classifyImportLocation = 'ember-css-composer/classify';
const classifyMacroImportLocation = 'ember-css-composer/classify-macro';

const plugin = function({ types: t }) {
  const ImportDeclarationFinder = {
    ImportDefaultSpecifier(path, state) {
      let declaration = path.findParent((path) => path.isImportDeclaration());
      let importPath = declaration.node.source.value;
      if (importPath === classifyImportLocation) {
        state.classifyIdentifier = path.node.local;
      } else if(importPath === classifyMacroImportLocation) {
        state.classifyMacroIdentifier = path.node.local;
      }
    }
  };

  const ClassNamesMacroFinder = {
    StringLiteral(path, state) {
      let value = path.node.value;
      let parentIdentifier = state.parentIdentifier;
      
      // If no @ symbol, skip.
      if (value.charAt(0) !== '@') {
        return path.skip();
      }

      // Mark that we need the classify macro
      state.classifyImportNeeded = true;

      // Replace the string with the function to classify.
      path.replaceWith(classifyString(state.classifyIdentifier, value));
    }
  };

  const ClassNameBindingsMacroFinder = {
    StringLiteral(path, state) {
      let value = path.node.value;
      let parentIdentifier = state.parentIdentifier;

      // If no :@ symbol, skip.
      if (value.indexOf(':@') === -1) {
        return path.skip();
      }

      // Mark that we need the various classify imports.
      state.classifyMacroImportNeeded = true;
      state.classifyImportNeeded = true;

      // Get the various bits from the value.
      let [objectKey, truthy = '', falsey = ''] = value.split(':');
      
      let macroArgs = [];

      // Add the first arg as a string declaration.
      macroArgs.push(t.stringLiteral(objectKey));
      macroArgs.push(classifyString(state.classifyIdentifier, truthy));
      macroArgs.push(classifyString(state.classifyIdentifier, falsey));

      // Create a new UID key for the object.
      let macroKey = path.scope.generateUidIdentifierBasedOnNode(parentIdentifier.parent, objectKey || 'classifyMacro');
      
      path.replaceWith(t.stringLiteral(macroKey.name));

      // Create the new Object expression.
      let prop = t.objectProperty(macroKey, t.callExpression(state.classifyMacroIdentifier, macroArgs));
      parentIdentifier.insertAfter([prop]);
    }
  };

  return {
    visitor: {
      ObjectProperty(path, state) {
        let attr = path.node.key.name;

        // Make the current property available to sub-traversal
        state.parentIdentifier = path;
        
        if (attr === 'classNames') {
          path.traverse(ClassNamesMacroFinder, state);
        } else if (attr === 'classNameBindings') {
          path.traverse(ClassNameBindingsMacroFinder, state);
        }

        // Remove parent Identifier from state
        delete state.parentIdentifier;
      },
      Program: {
        enter(path, state) {
          path.traverse(ImportDeclarationFinder, state);

          if (!state.classifyIdentifier) {
            state.doesNotHaveClassifyImport = true;
            state.classifyIdentifier = path.scope.generateUidIdentifier('classify');
          }

          if (!state.classifyMacroIdentifier) {
            state.doesNotHaveClassifyMacroImport = true;
            state.classifyMacroIdentifier = path.scope.generateUidIdentifier('classifyMacro');
          }
        },
        exit(path, state) {
          if (state.classifyImportNeeded && state.doesNotHaveClassifyImport) {
            makeImportStatement(path, state.classifyIdentifier, classifyImportLocation);
          }

          if (state.classifyMacroImportNeeded && state.doesNotHaveClassifyMacroImport) {
            makeImportStatement(path, state.classifyMacroIdentifier, classifyMacroImportLocation);
          }
        }
      }
    }
  }

  function classifyString(classifyIdentifier, string) {
    if (string.charAt(0) === '@') {
      return t.callExpression(classifyIdentifier, [
        t.stringLiteral(string.slice(1))
      ]);
    } else {
      return t.stringLiteral(string);
    }
  }

  function makeImportStatement(path, identifier, importPath) {
    let specifier = t.importDefaultSpecifier(identifier);
    let importsFrom = t.stringLiteral(importPath);
    let declaration = t.importDeclaration([specifier], importsFrom);
    path.unshiftContainer('body', declaration);
  }
};

module.exports = plugin;