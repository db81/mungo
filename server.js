"use strict"
require('app-module-path').addPath(__dirname)
require('babel-polyfill')
require('babel-register')

const Express = require('express')
const compression = require('compression')
const AppRequest = require('./request.js').default

let app = Express()

app.use(Express.static('build'))
app.use(AppRequest)
app.use(compression())

let port = parseInt(process.argv[2]) || 8080
app.listen(port, () => console.log('Listening on port ' + port + '...'))
