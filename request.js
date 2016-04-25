import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { AppRoutes } from 'components'
import reducers from 'reducers'

export default function(req, res) {
    let store = createStore(reducers, { docs: { foo: 42 } }, applyMiddleware(thunk))
    match({ routes: AppRoutes, location: req.url }, (err, redirect, props) => {
        if (err) {
            res.status(500).send(err.message)
        } else if (redirect) {
            res.redirect(302, redirect.pathname + redirect.search)
        } else if (props) {
            res.send(`
                <!doctype html>
                <html>
                    <head>
                        <title>Mungo</title>
                    </head>
                    <body>
                        <div id="root">${renderToString(<Provider store={store}>
                            <RouterContext {...props} /></Provider>)}</div>
                        <script>document.__initialState = ${JSON.stringify(store.getState())}</script>
                        <script src="/bundle.js"></script>
                    </body>
                </html>
            `)
        } else {
            res.status(404).send('Not found.')
        }
    })
}
