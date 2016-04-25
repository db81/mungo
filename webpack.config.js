module.exports = {
	entry: 'client.jsx',
	output: {
		path: __dirname + '/build',
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{ test: /\.(js|jsx)$/, exclude: '/node_modules/', loader: 'babel' },
			{ test: /\.(png|jpg|gif|svg)$/, loader: 'url?limit=10000&name=[path][name].[ext]' },
			{ test: /\.(html|wav|ogg|webm)$/, loader: 'file?name=[path][name].[ext]' },
		]
	},
	resolve: {
		root: __dirname
	}
};
