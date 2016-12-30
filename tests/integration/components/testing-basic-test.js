import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('testing-basic', 'Integration | Component | testing basic', {
  integration: true
});

test('it renders', function(assert) {
  this.set('isOpen', true);
  this.render(hbs`
    {{#testing-basic class="main-thing" isOpen=isOpen}}
      Hi.
    {{/testing-basic}}
  `);

  let node = this.$('.main-thing');

  assert.ok(node.hasClass('tb-1'), 'node has tb-1 class');
  assert.ok(node.hasClass('tb-2'), 'node has tb-2 class');
  assert.ok(node.hasClass('tb-3'), 'node has tb-3 class');
  assert.ok(node.hasClass('tb-4'), 'node has tb-4 class');
  assert.ok(!node.hasClass('tb-5'), 'node does not have tb-5 class');

  let inner = this.$('.inner-thing');
  assert.ok(inner.hasClass('tb-6'), 'inner class has tb-6');
  assert.ok(inner.hasClass('tb-7'), 'inner class has tb-7');
  assert.ok(inner.hasClass('tb-8'), 'inner class has tb-8');

  this.set('isOpen', false);
  assert.ok(!node.hasClass('tb-3'), 'node does not have tb-3 class');
  assert.ok(!node.hasClass('tb-4'), 'node does not have tb-4 class');
  assert.ok(node.hasClass('tb-5'), 'node has tb-5 class');
});
