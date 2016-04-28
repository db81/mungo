"use strict"
// Make require search in source folder root, relative paths are ugly.
require('app-module-path').addPath(__dirname)
// Transpile everything required from this module with Babel.
require('babel-register')
require('babel-polyfill')

const Express = require('express')
const compression = require('compression')
const https = require('https')
const fs = require('fs')
const crypto = require('crypto')
const session = require('express-session')
const Config = require('./config.js').default
const appRequest = require('./request.js').default
const api = require('./api.js').default
const auth = require('./auth.js').default

let app = Express()

// A token to allow the server to access itself bypassing auth. There's
// surely a way to fetch from express directly instead of going through
// the TCP stack, but whatever.
global.localAccessToken = crypto.randomBytes(64).toString('hex')

app.use(Express.static('build'))
app.use(session({ secret: 'mungo', resave: false, saveUninitialized: false }))
app.use(auth)
app.use('/api', api)
app.use(appRequest)
app.use(compression())

if (Config.enableHttps) {
    https.createServer({
        key: fs.readFileSync(Config.keyFile),
        cert: fs.readFileSync(Config.certFile)
    }, app).listen(Config.port, Config.host,
        () => console.log('Listening on port ' + Config.port + ' (HTTPS)...'))
} else {
    app.listen(Config.port, Config.host, () => console.log('Listening on port ' + Config.port + '...'))
}
