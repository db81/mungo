import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { AppRoutes } from 'components'
import reducers from 'reducers'
import { fillCollections, fillCollection } from 'actions'

function renderSite(res, props) {
    let store = createStore(reducers, applyMiddleware(thunk))
    let promises = [store.dispatch(fillCollections())]
    if (props.params.collection) {
        promises.push(store.dispatch(fillCollection(props.params.collection)))
    }
    return Promise.all(promises).then(() => res.send(`
        <!doctype html>
        <html>
            <head>
                <meta charset="utf-8">
                <link href="/bundle.css" rel="stylesheet" type="text/css">
                <title>Mungo</title>
            </head>
            <body>
                <div id="root">${renderToString(
                    <Provider store={store}><RouterContext {...props} /></Provider>
                )}</div>
                <script>document.__initialState = ${JSON.stringify(store.getState())}</script>
                <script src="/bundle.js"></script>
            </body>
        </html>
    `)).catch(err => res.status(500).send(err.message))
}

export default function(req, res, next) {
    match({ routes: AppRoutes, location: req.url }, (err, redirect, props) => {
        if (err) {
            res.status(500).send(err.message)
        } else if (redirect) {
            res.redirect(302, redirect.pathname + redirect.search)
        } else if (props) {
            renderSite(res, props)
        } else {
            //res.status(404).send('Not found.')
            next()
        }
    })
}
