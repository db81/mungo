import React from 'react'
import { Router, Route, Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'

export let AppRoutes =
    <Router history={browserHistory}>
        <Route path="/" component={Index}>
            <Route path=":view" component={View} />
        </Route>
    </Router>

let Docs = connect(({docs}) => ({docs}))(props => <p>{JSON.stringify(props.docs)}</p>)

export function Index(props) {
    return <div>
        <div>Index</div>
        <div>{props.children}</div>
        <Docs />
    </div>
}

export function View(props) {
    return <p>View {props.params.view}. <Link to="/">Back</Link>.</p>
}
