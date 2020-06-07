const IsPlainObject = Phaser.Utils.Objects.IsPlainObject;

export class WebfontLoader {
  type = 'webfont';
  key: string;
  state: number;
  loader: Phaser.Loader.LoaderPlugin;
  config: WebfontFontConfig;
  loaderOptions: WebfontLoaderConfig;

  constructor(loader: Phaser.Loader.LoaderPlugin, fontConfig: WebfontFontConfig, loaderOptions: WebfontLoaderConfig) {
    this.loader = loader;
    this.config = fontConfig;
    this.key = fontConfig.font;
    this.loaderOptions = loaderOptions;
    this.state = Phaser.Loader.FILE_POPULATED;
  }

  load(): this {
    const link = document.createElement('link');
    link.href = this.config.url;
    link.rel = 'stylesheet';
    link.onload = () => this.checkLoadStatus();

    document.head.appendChild(link);

    return this;
  }

  private checkLoadStatus(): void {
    Promise.all(
      this.config.variants.map((variant: string) => {
        if (document.fonts) {
          return this.loadFontWithFontFace(variant);
        } else {
          return this.loadFontLegacy(variant);
        }
      })
    ).then(() => {
      this.loader.nextFile((this as unknown as Phaser.Loader.File), true);
    });
  }

  private loadFontWithFontFace(variant: string): Promise<void> {
    return document.fonts.load(`${variant} 12px '${this.config.font}'`, this.loaderOptions?.testString) as unknown as Promise<void>;
  }

  private loadFontLegacy(variant: string): Promise<void> {
    return new Promise((resolve) => {
      const el = document.createElement('span');
      el.style.visibility = 'hidden';
      el.style.position = 'absolute';
      el.style.font = variant + ' 12px ' + this.config.font;
      el.innerText = 'abc';
      document.body.appendChild(el);

      setTimeout(() => {
        document.body.removeChild(el);
        resolve();
      }, this.loaderOptions?.legacyTimeout || 50);
    });
  }

  hasCacheConflict(): boolean {
    return false;
  }

  addToCache(): void {
    // no-op - called by Phaser.LoaderPlugin
  }

  onProcess(): void {
    this.state = Phaser.Loader.FILE_COMPLETE;

    this.loader.fileProcessComplete((this as unknown as Phaser.Loader.File));
  }
}

const loaderCallback = function (font, url, options) {
  if (IsPlainObject(font)) {
    font.url = url;
  } else {
    font = {
      font,
      url
    };
  }

  if (!font.variants) {
    font.variants = ['normal'];
  }

  this.addFile(new WebfontLoader(this, font, options));

  return this;
}

export class WebFontLoaderPlugin extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);

    pluginManager.registerFileType('webfont', loaderCallback);

    if (!document.fonts) {
      console.warn('Browser does not support FontFaceSet');
    }
  }
}

type WebfontFontConfig = {
  font: string;
  url?: string;
  variants?: string[];
};

type WebfontLoaderConfig = {
  testString: string;
  legacyTimeout: number;
};

declare module 'phaser' {
  namespace Loader {
    interface LoaderPlugin {
      webfont(font: WebfontFontConfig | string, url?: string, options?: WebfontLoaderConfig): this;
    }
  }
}
