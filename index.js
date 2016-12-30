/* jshint node: true */
'use strict';

const CSStoJSON = require('./lib/css-plugin/index');
const BabelPlugin = require('./lib/babel-plugin/index');
const MergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');

module.exports = {
  name: 'ember-css-composer',
  
  included: function(app) {
    this._super.included(app);

    app.options = app.options || {};
    app.options.babel = app.options.babel || {};
    app.options.babel.plugins = app.options.babel.plugins || [];

    if (!this._registeredWithBabel) {
      // TODO: Only need to transform files in the app & addon. Maybe
      // make this a preprocessor with broccoli-funnel
      app.options.babel.plugins.push(BabelPlugin);
      this._registeredWithBabel = true;
    }
  },

  setupPreprocessorRegistry: function(type, registry) {
    // Skip if we're setting up this addon's own registry
    if (type !== 'parent') { 
      return; 
    }
    
    registry.add('htmlbars-ast-plugin', {
      name: 'ember-css-modules',
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
      outputFile: 'modules/ember-css-composer/css-classes-json.js' 
    });

    return new MergeTrees([addonTree, configFileTree]);
  }
};
