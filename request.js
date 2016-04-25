import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import { AppRouter } from 'components'

export default function(req, res) {
    match({ routes: AppRouter, location: req.url }, (err, redirect, props) => {
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
                        <div id="root">${renderToString(<RouterContext {...props} />)}</div>
                        <script src="/bundle.js"></script>
                    </body>
                </html>
            `)
        } else {
            res.status(404).send('Not found.')
        }
    })
}
