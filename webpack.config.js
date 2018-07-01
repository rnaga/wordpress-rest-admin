// webpack.config.js
// For library build

const path = require("path");
const glob = require("glob");

process.env.NODE_ENV='production';
const library = 'wordpress-rest-admin';

const getEntries = entryPath => {

    // e.g. containers/**/*.js
    return glob.sync('./src/' + entryPath)
    .reduce( (entries, entry) => {
    
        const key = entry.replace('./src/', '').replace('.js', '');

        // Skip test files
        if(!entry.match(/.test./))
            return Object.assign(entries, {[key]: entry}) 
           
        return entries
              
    }, {})
}

const getNpmConfig = (varname, _default) => {
    return process.env["npm_config_" + varname] || _default;
}

// glob path to set the entry point
const entryPath  = getNpmConfig('entryPath', null);

// Path for output files
const outputPath = getNpmConfig('outputPath', path.resolve(__dirname, "dist"));

const entries = !entryPath ? {WPAdmin: "./src/WPAdmin.js"} : getEntries(entryPath); 

module.exports = {
    entry: entries,
    output: {
        path: outputPath,
        filename: "[name].js",
        library: [library, "[name]"],
        libraryTarget: 'commonjs2'
    },

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


