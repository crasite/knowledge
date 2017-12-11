const webpack = require('webpack')
var path = require('path')

module.exports = {
    entry:{
        math: './src/math/math.ts'
    } ,
    output: {
        path: path.join(__dirname,'public/javascripts'),
        filename: '[name].bundle.js'
    },
    resolve: {
        extensions: [ ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        loaders: [
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    }
}
