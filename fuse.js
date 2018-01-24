const { UglifyESPlugin } = require("fuse-box/plugins/UglifyESPlugin");
const { UglifyJSPlugin } = require("fuse-box/plugins/UglifyJSPlugin");

const {exec} = require("child_process")
const { FuseBox, WebIndexPlugin, QuantumPlugin,StylusPlugin,CSSPlugin, Sparky } = require("fuse-box");
const { src, task, context, tsc, watch } = require('fuse-box/sparky');
const isProduction = false;

task('default',async context => {
    // context.isProduction = true;
    const bundleName = "public/javascripts/main"
    const fuse = context.getConfig(bundleName);
    context.createBundle(fuse,bundleName);
    await fuse.run();
});

task('production',async context => {
    context.isProduction = true;
    const bundleName = "public/javascripts/main"
    const fuse = context.getConfig(bundleName);
    context.createBundle(fuse,bundleName);
    await fuse.run();
});

task('transpile', () => {
    exec("tsc --watch")
});

task('runServer', () => {
    exec("nodemon dist/app")
});

task('whole',["&transpile","&runServer","default"])

context(class {
    getConfig(bundleName) {
        return FuseBox.init({
            homeDir: "src",
            target: 'browser@es5',
            output: "$name.bundle.js",
            plugins: [
                [StylusPlugin(), CSSPlugin()],
                this.isProduction && UglifyJSPlugin()
            ]
        })
    };

    createBundle(fuse,name){
        const bundle = fuse.bundle(name).instructions(" > main.ts");
        if(!this.isProduction){
            bundle.watch();
        }
        return bundle
    }
});