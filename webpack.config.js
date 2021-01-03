// webpack.config.js
// For library build

const path = require("path");
const glob = require("glob");
const nodeExternals = require('webpack-node-externals');

process.env.NODE_ENV='production';
const library = 'wordpress-rest-admin';

const getEntries = entryPath => {

    if(0 >= entryPath.length)
        return null;

    // e.g. containers/**/*.js
    const entries = glob.sync('./src/' + entryPath.shift())
    .reduce( (entries, entry) => {
    
        const key = entry.replace('./src/', '').replace('.js', '');

        // Skip test files
        if(!entry.match(/.test./))
            return Object.assign(entries, {[key]: entry}) 
           
        return entries
              
    }, {})

    return Object.assign(entries, getEntries(entryPath));

}

const getNpmConfig = (varname, _default) => {
    return process.env["npm_config_" + varname] || _default;
}

// glob path to set the entry point
const entryPath = getNpmConfig('entryPath', null);

// Path for output files
const outputPath = getNpmConfig('outputPath', path.resolve(__dirname, "dist"));

const entries = !entryPath 
              ? {WPAdmin: "./src/WPAdmin.js"} 
              : getEntries(entryPath.split(","));

module.exports = {
    entry: entries,
    output: {
        path: outputPath,
        filename: "[name].js",
        library: [library, "[name]"],
        libraryTarget: 'commonjs2'
    },

    externals: [nodeExternals()],

    devtool: "source-map",

    module: {rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader", "eslint-loader"]
    },{
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
    },{
        loader: require.resolve('file-loader'),
        exclude: [/\.(js|jsx|mjs|css)$/, /\.html$/, /\.json$/],
        options: { name: '[name].[ext]' }
    }]}
}


