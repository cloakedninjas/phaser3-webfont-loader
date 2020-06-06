const IsPlainObject = Phaser.Utils.Objects.IsPlainObject;

export class WebfontLoader extends Phaser.Loader.File {
  public type = 'webfont';

  public load(): void {
    if (this.state === Phaser.Loader.FILE_POPULATED) {
      this.loader.nextFile(this, true);
      return;
    }

    const link = `<link href="${this.url}" rel="stylesheet">`;
    const testString = this.config.testString || 'hello there';

    document.head.insertAdjacentHTML('beforeend', link);

    if (document.fonts) {
      document.fonts.load(`12px '${this.key}'`, testString).then(() => {
        this.loader.nextFile(this, true);
      });
    } else {
      setTimeout(() => {
        this.loader.nextFile(this, false);
      }, this.config.legacyTimeout || 50);
    }
  }
}

const loaderCallback = function (key, url, testString) {
  let config;

  if (IsPlainObject(key)) {
    config = key;
  } else {
    config = {
      url,
      key,
      config: {
        testString
      }
    };
  }

  config.type = 'webfont';
  this.addFile(new WebfontLoader(this, config));

  return this;
}

export class WebFontLoaderPlugin extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);

    pluginManager.registerFileType('webfont', loaderCallback);

    if (document.fonts) {
      console.warn('Browser does not support FontFaceSet');
    }
  }
}