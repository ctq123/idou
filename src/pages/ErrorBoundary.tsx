import React from 'react';
import { Result } from 'antd';

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: any, info: any) {
    // Display fallback UI
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <Result status="error" title="Something went wrong" />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
