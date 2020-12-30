import React from "react";
import ErrorBoundary from '../../src/ErrorBoundary';
import { GitHubContextProvider } from '../../src/GitHubContext';
import Chart from '../../src/components/Chart';

const App: React.FC = () => (
  <ErrorBoundary>
    <GitHubContextProvider token="abc123">
      <h1>Agile GitHub</h1>
      <Chart />
    </GitHubContextProvider>
  </ErrorBoundary>
);

export default App;
