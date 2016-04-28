import { connect } from 'react-redux'

// A version of connect for picking state based on props.
export let connectProps = (f => connect(x => x, dispatch => ({ dispatch }),
    (state, d, { children, ...props}) => ({ ...d, children, ...f(state, props) })))
