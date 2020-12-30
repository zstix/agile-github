import React from "react";
import ErrorBoundary from '../../src/ErrorBoundary';
import { GitHubContextProvider } from '../../src/GitHubContext';
import BurndownChart from '../../src/components/BurndownChart';

const App: React.FC = () => (
  <ErrorBoundary>
    <GitHubContextProvider token="abc123">
      <h1>Agile GitHub</h1>
      <BurndownChart />
    </GitHubContextProvider>
  </ErrorBoundary>
);

export default App;
