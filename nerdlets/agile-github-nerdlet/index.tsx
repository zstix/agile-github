import React from "react";
import ErrorBoundary from '../../src/ErrorBoundary';
import { GitHubContextProvider } from '../../src/GitHubContext';
import Chart from '../../src/components/Chart';

interface AppProps {
  utils: {
    noticeError: (error: Error, attributes?: any) => void;
  }
}

const App: React.FC<AppProps> = (props) => (
  <ErrorBoundary noticeError={props.utils.noticeError}>
    <GitHubContextProvider token="abc123">
      <h1>Agile GitHub</h1>
      <Chart />
    </GitHubContextProvider>
  </ErrorBoundary>
);

export default App;
