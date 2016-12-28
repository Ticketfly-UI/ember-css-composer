# ember-css-composer

This addon provides a few simple tools to move the CSS-dependent configuration of components out of 
Javascript/Handlebars and moves it into a CSS-like configuration file. There are two things this
might be good for:

1. If you a developer of an addon that exposes components and you want the consumers of your addon to 
easily override the different class names for the various states of your components (rather than exposing
configuration options on the component itself)

2. If you're using Functional CSS and you want a way to compose your classes together into named components
so you don't have needlessly long lists of class names everywhere. 

## Examples

### A List Component

Given this set of files:

```js
// addon/components/a-list.js
import Component from 'ember-component';

export default Component.extend({
  classNames: ['@a-list-component'],
  classNameBindings: ['isOpen:@a-list-is-open:@a-list-is-closed'],
  isOpen: false
});
```

```hbs
{{! addon/templates/components/a-list.hbs }}
{{#each list as |listItem index|}}
  <li class="@a-list-item">
    {{yield listItem index}}
  </li>
{{/each}}
```

```css
/* addon/styles/config.css-config */
.a-list-component {
  composes: 'my-list', 'background-g3', 'font-size-big';
}

.a-list-is-open {
  composes: 'my-list__open', 'background-g6';
}

.a-list-is-closed {
  composes: 'my-list__closed';
}

.a-list-item {
  composes: 'my-list-item', 'color-g4-hover';
}
```

Given all of these settings, this will transpile those files into this:

```js
// addon/components/a-list.js
import Component from 'ember-component';
import { classNamesMacro } from 'ember-css-composer';
const isOpenSymbol = Symbol();

export default Component.extend({
  classNames: ['my-list', 'background-g3', 'font-size-big'],
  classNameBindings: [`${isOpenSymbol}`],
  [isOpenSymbol]: classNamesMacro('isOpen', ['my-list__open', 'background-g6'], ['my-list__closed']),
  isOpen: false
});
```

```hbs
{{! addon/templates/components/a-list.hbs }}
{{#each list as |listItem index|}}
  <li class="my-list-item color-g4-hower">
    {{yield listItem index}}
  </li>
{{/each}}
```

## The Pieces

1. A Broccoli Plugin for finding the config files and processing in order from addon up to app. 
  - Should create an in memory file for converting a class name into a list of class names
2. The `classNamesMacro` for converting `classNameBindings` that have truthy/falsey values.
3. Babel Plugin to transpile component files looking for string definitions beginning with `@`
  - Imports file from step 1
4. HTMLBars Plugin to transpile template files looking for `class="@"`
  - Imports file from step 2

## Installation

* `ember install ember-css-composer`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
