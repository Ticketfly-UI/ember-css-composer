/* jshint node: true */
'use strict';

const LOOKUP_OUTPUT = 'css-classes-json.js';
const CSStoJSON = require('./lib/css-plugin/index');
const BabelPlugin = require('./lib/babel-plugin/index');
const BabelTranspiler = require('broccoli-babel-transpiler');
const MergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');

module.exports = {
  name: 'ember-css-composer',

  setupPreprocessorRegistry: function(type, registry) {
    // Skip if we're setting up this addon's own registry
    if (type !== 'parent') { 
      return; 
    }

    registry.add('js', {
      name: 'ember-css-composer-babel',
      toTree: function(inputTree) {
        return BabelTranspiler(inputTree, {
          whitelist: [],
          plugins: [BabelPlugin]
        });
      }
    });
    
    registry.add('htmlbars-ast-plugin', {
      name: 'ember-css-composer-handlebars',
      plugin: require('./lib/htmlbars-plugin/index'),
      baseDir: function() {
        return __dirname;
      }
    });
  },

  treeForAddon(tree) {
    var addonTree = this._super.treeForAddon.call(this, tree);

    let cssComposeTree = new Funnel(this.app.trees.app, {
      include: ['**/*.css-compose']
    });

    let configFileTree = CSStoJSON(cssComposeTree, { 
      outputFile: `modules/ember-css-composer/${LOOKUP_OUTPUT}`
    });

    return new MergeTrees([addonTree, configFileTree]);
  }
};
