const { FuseBox, WebIndexPlugin, QuantumPlugin } = require("fuse-box");
const isProduction = false;
const fuse = FuseBox.init({
    homeDir : "src",
    target : 'browser@es6',
    output : "public/javascripts/$name.bundle.js",
     plugins : [
        WebIndexPlugin(),
        isProduction && QuantumPlugin({
            bakeApiIntoBundle:'app',
            uglify:true
        })
    ]
})
fuse.bundle("main").instructions(" > main.ts").watch()
fuse.run();