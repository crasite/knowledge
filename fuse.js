const {exec} = require("child_process")
const { FuseBox, WebIndexPlugin, QuantumPlugin,StylusPlugin,CSSPlugin, Sparky } = require("fuse-box");
const { src, task, context, tsc, watch } = require('fuse-box/sparky');
const isProduction = false;

task('default',async context => {
    const fuse = context.getConfig();
    context.createBundle(fuse,"public/javascripts/main");
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
    getConfig() {
        return FuseBox.init({
            homeDir: "src",
            target: 'browser@es6',
            output: "$name.bundle.js",
            sourceMaps: true,
            plugins: [
                [StylusPlugin(), CSSPlugin()],
                isProduction && QuantumPlugin({
                    bakeApiIntoBundle: 'app',
                    uglify: true
                })
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