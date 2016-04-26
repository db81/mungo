"use strict"
// Make require search in source folder root, relative paths are ugly.
require('app-module-path').addPath(__dirname)
// Transpile everything required from this module with Babel.
require('babel-register')

const Express = require('express')
const compression = require('compression')
const AppRequest = require('./request.js').default
const Api = require('./api.js').default

let app = Express()

app.use(Express.static('build'))
app.use('/api', Api)
app.use(AppRequest)
app.use(compression())

let port = parseInt(process.argv[2]) || 8080
app.listen(port, () => console.log('Listening on port ' + port + '...'))
