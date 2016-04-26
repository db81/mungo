import React from 'react'
import { Router, Route, Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'

export let AppRoutes =
    <Router history={browserHistory}>
        <Route path="/" component={Index}>
            <Route path="views/:view" component={View} />
        </Route>
    </Router>

let StoreState = connect(store => ({store}))(props => <pre>{JSON.stringify(props.store, null, 2)}</pre>)

export function Index(props) {
    return <div>
        <div>Index</div>
        <div>{props.children}</div>
        <StoreState />
    </div>
}

export function View(props) {
    return <p>View {props.params.view}. <Link to="/">Back</Link>.</p>
}
