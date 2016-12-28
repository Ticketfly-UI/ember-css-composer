const classifyImportLocation = 'ember-css-composer/classify';

const plugin = function({ types: t }) {
  const ImportDeclarationFinder = {
    ImportDefaultSpecifier(path, state) {
      let declaration = path.findParent((path) => path.isImportDeclaration());

      if (declaration.node.source.value === classifyImportLocation) {
        state.classifyIdentifier = path.node.local;
        path.stop();
      }
    }
  };

  return {
    visitor: {
      StringLiteral(path, state) {
        let value = path.node.value;

        // If no @ symbol, skip.
        if (value.charAt(0) !== '@') {
          return path.skip();
        }
        
        // Only do anything else if this is a descendent of a classNames/classNameBindings key
        let parentIdentifier = path.findParent((path) => {
          if (!path.isObjectProperty()) {
            return false;
          }

          let name = path.node.key.name;
          return name === 'classNames' || name === 'classNameBindings';
        });
        
        if (parentIdentifier) {
          state.classifyImportNeeded = true;
          path.replaceWith(t.callExpression(state.classifyIdentifier, [
            t.stringLiteral(value.slice(1))
          ]));
        }
      },
      Program: {
        enter(path, state) {
          path.traverse(ImportDeclarationFinder, state);

          if (!state.classifyIdentifier) {
            state.doesNotHaveClassifyImport = true;
            state.classifyIdentifier = path.scope.generateUidIdentifier('classify');
          };
        },
        exit(path, state) {
          if (state.classifyImportNeeded && state.doesNotHaveClassifyImport) {
            let specifier = t.importDefaultSpecifier(state.classifyIdentifier);
            let importsFrom = t.stringLiteral(classifyImportLocation);
            let declaration = t.importDeclaration([specifier], importsFrom);
            path.unshiftContainer('body', declaration);
          }
        }
      }
    }
  }
};

module.exports = plugin;