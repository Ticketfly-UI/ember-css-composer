# ember-css-composer

This addon provides a few simple tools to move the CSS-dependent configuration of components out of 
Javascript/Handlebars and moves it into a CSS-like configuration file. There are two things this
might be good for:

1. If you are developer of an addon that exposes components and you want the consumers of your addon to 
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
/* app/styles/app.css */
@composer {
  @a-list-component {
    composes: 'my-list', 'background-g3', 'font-size-big';
  }

  @a-list-is-open {
    composes: 'my-list__open', 'background-g6';
  }

  @a-list-is-closed {
    composes: 'my-list__closed';
  }

  @a-list-item {
    composes: 'my-list-item', 'color-g4-hover';
  }
}
```

Given all of these settings, this will transpile those files into something like this:

```js
// addon/components/a-list.js
import Component from 'ember-component';
import _classifyMacro from 'ember-css-composer/classify-macro';

export default Component.extend({
  classNames: ['my-list', 'background-g3', 'font-size-big'],
  classNameBindings: ['_isOpen'],
  _isOpen: _classNameMacro('isOpen', ['my-list__open', 'background-g6'], ['my-list__closed']),
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

### Dynamically Generated Class Names

In the event that you need to dynamically generate class names, you can directly import the `classify`
utility to convert a key into a list of class names. For example:

```css
/* app/styles/app.css */
@composer {
  @myComponent-red {
    composes: 'red';
  }

  @myComponent-blue {
    composes: 'blue';
  }

}
```

```js
import Component from 'ember-component';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import { classify } from 'ember-css-composer';

export default Component.extend({
  classNameBindings: ['colorClass'],
  color: 'red',

  colorClass: computed('color', {
    get() {
      return classify(`myComponent-${get(this, 'color')}`);
    }
  })
});
```

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

![Amadeus](http://24.media.tumblr.com/tumblr_mcbz1pZFKN1qllovxo1_500.gif)
