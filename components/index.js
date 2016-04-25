import React from 'react'
import { Router, Route, Link, browserHistory } from 'react-router'

export let AppRouter =
    <Router history={browserHistory}>
        <Route path="/" component={Index}>
            <Route path="/view/:view" component={View} />
        </Route>
    </Router>

export function Index(props) {
    return <div>
        <div>Index</div>
        <div>{props.children}</div>
    </div>
}

export function View(props) {
    return <p>View {props.params.view}. <Link to="/">Back</Link>.</p>
}
