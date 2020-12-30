import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
};

interface ErrorBoundaryState {
  error: Error;
  info: React.ErrorInfo;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      error: null,
      info: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error, info: null };
  }

  componentDidCatch(_error: Error, info: React.ErrorInfo) {
    this.setState({ info });
  }

  render() {
    const { error, info } = this.state;

    if (!error) {
      return this.props.children;
    }

    return (
      <>
        <h2>Huh?</h2>
        <p>Something went wrong...</p>
        <details style={{ whiteSpace: 'pre-wrap' }}>
          {error && error.toString()}
          <br />
          {info && info.componentStack}
        </details>
        <img src="https://media.giphy.com/media/3EiNpweH34XGoQcq9Q/giphy.gif" />
      </>
    );
  };
}

export default ErrorBoundary;