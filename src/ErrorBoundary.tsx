import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  noticeError: (error: Error, attributes?: any) => void;
};

interface ErrorBoundaryState {
  error: boolean;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    console.log('props are this', props);
    this.state = { error: false };
  }

  static getDerivedStateFromError() {
    console.log('catch');
    return { error: true };
  }

  componentDidCatch(error: Error) {
    this.props.noticeError(error, { unhandledError: true });
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <>
        <h2>Huh?</h2>
        <img src="https://media.giphy.com/media/3EiNpweH34XGoQcq9Q/giphy.gif" />
      </>
    );
  };
}

export default ErrorBoundary;