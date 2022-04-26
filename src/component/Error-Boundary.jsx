import React from "react";

export class ErrorBoundary extends React.Component {
    state = {error: null}

    // 当子组件抛出异常， 这里会接收到并且调用
    static getDerivedStateFromError(error) {
        return {error}
    }

    render() {
        const {error} = this.state
        const {fallbackRender, children} = this.props
        if (error) {
            return fallbackRender({error})
        }
        return children
    }
}