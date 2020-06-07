# Phaser 3 Webfont Loader

A webfont loader for Phaser 3 that uses CSS `@font-face` to download the font and `FontFaceSet` to trigger / detect the load.

If the browser does not support `FontFaceSet` (see [compatability table](https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/load#Browser_compatibility)) the loader will attempt to inject an invisible HTML element into the page to trigger the browser to download the font file. A delay of 50ms is waited for before loading completes and the element removed. This delay is configurable in [Loader Config](#loader-config)

## Installation

```console
$ npm install -D phaser3-webfont-loader
```

## Usage

### Import the plugin

```js
import { WebFontLoaderPlugin } from 'phaser3-webfont-loader';
```

### Load the plugin

```js
new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create
  },
  plugins: {
    global: [{
      key: 'WebFontLoader',
      plugin: WebFontLoaderPlugin,
      start: true
    }]
  }
});
```

### Load a font

```js
function preload() {
  this.load.webfont('Open Sans', 'https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');
}
```

### Use it

```js
function create() {
  this.add.text(400, 300, 'Hello there', {
    fontFamily: 'Open Sans',
    fontSize: '12px'
  });
}
```

See [a working example](/example/index.html)

## Fonts with multiple variants

```js
function preload() {
  this.load.webfont({
    font: 'Roboto',
    variants: [
      'normal',
      '100',
      '700',
      '700 italic'
    ]
  }, 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,500;1,400;1,700&display=swap');
}

function create() {
  this.add.text(400, 300, 'Hello there', {
    fontFamily: 'Roboto',
    fontSize: '12px',
    fontStyle: '700 italic'
  });
}
```


## Loader Config


| config | description | default |
|--|--|--|
| testString | 2nd argument for `FontFaceSet.load()`| "" |
| legacyTimeout | Time (in ms) to wait before sending success callback to Phaser Loader| 50 |


```js
this.load.webfont('Open Sans', 'https://fonts.googleapis.com/css2?family=Open+Sans&display=swap', {
  testString: 'Text Here',
  legacyTimeout: 100
});
```