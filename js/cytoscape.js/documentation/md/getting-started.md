This section will familiarise you with the basic steps necessary to start using Cytoscape.js.



## Including Cytoscape.js

If you are using a simple HTML environment (without a build system), then source Cytoscape.js in a `<script>` tag or [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) it as an ES6 module, e.g.:

```html
<script src="cytoscape.min.js"></script>
```
or
```html
<script type="module">
import cytoscape from "./cytoscape.esm.min.js";
</script>
```

To use Cytoscape.js from a CDN, use one of the following CDNs:

- [CDNJS](https://cdnjs.com/libraries/cytoscape)
- [jsDelivr](https://www.jsdelivr.com/package/npm/cytoscape?path=dist)
- [PageCDN](https://pagecdn.com/lib/cytoscape)
- [Unpkg](https://unpkg.com/cytoscape/dist/)

Please do not hotlink to copies of Cytoscape.js from the documentation --- they're just for the demos.

The available files are available under [`cytoscape/dist/`](https://github.com/cytoscape/cytoscape.js/tree/master/dist) in the npm package:

- `cytoscape.min.js` : A minified UMD build with all dependencies included in the bundle.  This file is useful for small pages, supplementary material for an academic paper for example.
- `cytoscape.umd.js` : A non-minified UMD build with all dependencies included in the bundle.  This file is useful for debugging on small pages, supplementary material for an academic paper for example.
- `cytoscape.esm.min.js` : A minified ESM (`import` / `export`) build with all dependencies included in the bundle.  This file serves the same purpose as the above, but it can be imported as an ES6 module without the need for a bundler.
- `cytoscape.cjs.js` : A non-minified CJS (Node.js) build without any bundled dependencies.  This is intended to be consumed automatically by Node.js or a bundler like Webpack via `require('cytoscape')`.
- `cytoscape.esm.js` : A non-minified ESM (`import` / `export`) build without any bundled dependencies.  This is intended to be consumed automatically by Node.js or a bundler like Webpack via `import cytoscape from 'cytoscape'`.

<span class="important-indicator"></span> Note that Cytoscape.js uses the dimensions of your HTML DOM element container for layouts and rendering at initialisation.  Thus, it is very important to place your CSS stylesheets in the `<head>` before any Cytoscape.js-related code.  Otherwise, dimensions may be sporadically reported incorrectly, resulting in undesired behaviour.

Your stylesheet may include something like this (assuming a DOM element with ID `cy` is used as the container):

```css
#cy {
  width: 300px;
  height: 300px;
  display: block;
}
```

To install Cytoscape.js via npm:

```bash
npm install cytoscape
```

To use Cytoscape.js in a ESM environment with npm (e.g. Webpack or Node.js with the [`esm`](https://www.npmjs.com/package/esm) package):

```js
import cytoscape from 'cytoscape';
```

To use Cytoscape.js in a CommonJS environment like Node.js:

```js
var cytoscape = require('cytoscape');
```

To use Cytoscape.js with AMD/Require.js:

```js
require(['cytoscape'], function(cytoscape){
  // ...
});
```

To install Cytoscape.js via Bower:

```bash
bower install cytoscape
```

To install Cytoscape.js via Meteor/Atmosphere:

```bash
npm install cytoscape
```

Cytoscape.js supports environments with ES5 or newer, as it is transpiled by Babel and it uses only basic features of the standard library.  Feature detection is used for optional features that improve performance.  However, a future version of Cytoscape.js may require a more up-to-date version of the standard library.  You may want to use [`babel-polyfill`](https://babeljs.io/docs/usage/polyfill/) or [`core-js`](https://github.com/zloirock/core-js) if you want to support old browsers in future.



## Initialisation

An instance of Cytoscape.js corresponds to a graph.  You can create an instance as follows:

```js
var cy = cytoscape({
  container: document.getElementById('cy') // container to render in
});
```

You can pass a jQuery instance as the `container` for convenience:

```js
var cy = cytoscape({
  container: $('#cy')
});
```

If you are running Cytoscape.js in Node.js or otherwise running it headlessly, you will not specify the `container` option.  In implicitly headless environments like Node.js, an instance is automatically headless.  To explicitly run a headless instance (e.g. in the browser) you can specify `options.headless` as `true`.



## Specifying basic options

For visualisation, the `container`, [`elements`](#notation/elements-json), [`style`](#style), and [`layout`](#layouts) options usually should be set:

```js
var cy = cytoscape({

  container: document.getElementById('cy'), // container to render in

  elements: [ // list of graph elements to start with
    { // node a
      data: { id: 'a' }
    },
    { // node b
      data: { id: 'b' }
    },
    { // edge ab
      data: { id: 'ab', source: 'a', target: 'b' }
    }
  ],

  style: [ // the stylesheet for the graph
    {
      selector: 'node',
      style: {
        'background-color': '#666',
        'label': 'data(id)'
      }
    },

    {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle'
      }
    }
  ],

  layout: {
    name: 'grid',
    rows: 1
  }

});
```



## Next steps

Now that you have a core (graph) instance with basic options, explore the [core API](#core).  It's your entry point to all the features in Cytoscape.js.

If you have code questions about Cytoscape.js, please feel free to [post your question to Stackoverflow](http://stackoverflow.com/questions/ask?tags=cytoscape.js).
