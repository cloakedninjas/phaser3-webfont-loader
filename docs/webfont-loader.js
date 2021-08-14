const IsPlainObject = Phaser.Utils.Objects.IsPlainObject;
export class WebfontLoader {
    constructor(loader, fontConfig, loaderOptions) {
        this.type = 'webfont';
        this.loader = loader;
        this.config = fontConfig;
        this.key = fontConfig.font;
        this.loaderOptions = loaderOptions;
        this.state = Phaser.Loader.FILE_POPULATED;
    }
    load() {
        const link = document.createElement('link');
        link.href = this.config.url;
        link.rel = 'stylesheet';
        link.onload = () => this.checkLoadStatus();
        document.head.appendChild(link);
        return this;
    }
    checkLoadStatus() {
        Promise.all(this.config.variants.map((variant) => {
            if (document.fonts) {
                return this.loadFontWithFontFace(variant);
            }
            else {
                return this.loadFontLegacy(variant);
            }
        })).then(() => {
            this.loader.nextFile(this, true);
        });
    }
    loadFontWithFontFace(variant) {
        var _a;
        return document.fonts.load(`${variant} 12px '${this.config.font}'`, (_a = this.loaderOptions) === null || _a === void 0 ? void 0 : _a.testString);
    }
    loadFontLegacy(variant) {
        return new Promise((resolve) => {
            var _a;
            const el = document.createElement('span');
            el.style.visibility = 'hidden';
            el.style.position = 'absolute';
            el.style.font = variant + ' 12px ' + this.config.font;
            el.innerText = 'abc';
            document.body.appendChild(el);
            setTimeout(() => {
                document.body.removeChild(el);
                resolve();
            }, ((_a = this.loaderOptions) === null || _a === void 0 ? void 0 : _a.legacyTimeout) || 50);
        });
    }
    hasCacheConflict() {
        return false;
    }
    addToCache() {
        // no-op - called by Phaser.LoaderPlugin
    }
    onProcess() {
        this.state = Phaser.Loader.FILE_COMPLETE;
        this.loader.fileProcessComplete(this);
    }
}
const loaderCallback = function (font, url, options) {
    if (IsPlainObject(font)) {
        font.url = url;
    }
    else {
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
};
export class WebFontLoaderPlugin extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager) {
        super(pluginManager);
        pluginManager.registerFileType('webfont', loaderCallback);
        if (!document.fonts) {
            console.warn('Browser does not support FontFaceSet');
        }
    }
}
