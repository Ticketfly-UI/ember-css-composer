import Ember from 'ember';
import Component from 'ember-component';
import Helper from 'ember-helper';
import getOwner from 'ember-owner/get';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import ClassTransformPlugin from 'npm:../../lib/htmlbars-plugin';

const { compile } = Ember.__loader.require('ember-template-compiler');

moduleForComponent('', 'Integration | Template AST Plugin', {
  integration: true,
  beforeEach() {
    const owner = getOwner(this);
    owner.register('template:components/x-div', hbs`{{yield}}`);
    owner.register('component:x-div', Component.extend({}));
    owner.register('helper:classify', Helper.helper((params) => {
      return params.map((p) => p.toUpperCase()).join(' ');
    }));
  }
});

testTransformation('basic transforms on regular elements', {
  input: '<div class="@cat dog">Hello</div>',
  output: '<div class="{{classify "cat"}} dog">Hello</div>'
});

testTransformation('multiple transforms on regular elements', {
  input: '<div class="meow @cat @dog">Hello</div>',
  output: '<div class="{{classify "cat" "dog"}} meow">Hello</div>'
});

testTransformation('existing concat on regular elements', {
  input: '<div class={{concat "@cat" " " "@dog" " meow"}}>Hello</div>',
  output: '<div class="{{classify "cat" "dog"}} meow">Hello</div>'
});

testTransformation('nested existing concat on regular elements', {
  input: '<div class={{concat (concat "@cat") " " "@dog" " meow"}}>Hello</div>',
  output: '<div class="{{classify "cat" "dog"}} meow">Hello</div>'
});

testTransformation('basic transforms on components', {
  input: '{{#x-div class="@cat dog"}}Hello{{/x-div}}',
  output: '{{#x-div class=(concat (classify "cat") " dog")}}Hello{{/x-div}}'
});

testTransformation('multiple transforms on components', {
  input: '{{#x-div class="meow @cat @dog"}}Hello{{/x-div}}',
  output: '{{#x-div class=(concat (classify "cat" "dog") " meow")}}Hello{{/x-div}}'
});

testTransformation('nested transforms on components', {
  input: '{{#x-div class=(concat "@cat" " dog")}}Hello{{/x-div}}',
  output: '{{#x-div class=(concat (classify "cat") " dog")}}Hello{{/x-div}}'
});

testTransformation('double nested transforms on components', {
  input: '{{#x-div class=(concat "@cat" " " (concat "@hat") " dog")}}Hello{{/x-div}}',
  output: '{{#x-div class=(concat (classify "cat" "hat") " dog")}}Hello{{/x-div}}'
});

function testTransformation(title, { input, output, properties }) {
  test(title, function(assert) {
    this.setProperties(properties);

    this.render(compile(input, { plugins: { ast: [ClassTransformPlugin] } }));
    let actual = this.$().html().replace(/id="\w+"/g, '');

    this.render(compile(output));
    let expected = this.$().html().replace(/id="\w+"/g, '');

    assert.equal(actual, expected);
  });
}
