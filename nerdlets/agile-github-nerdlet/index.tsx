import React from "react";
import ErrorBoundary from '../../src/ErrorBoundary';
import { GitHubContextProvider } from '../../src/GitHubContext';
import BurndownChart from '../../src/components/BurndownChart';
import Configuration from '../../src/components/Configuration';

const App: React.FC = () => (
  <ErrorBoundary>
    <GitHubContextProvider>
      <h1>Agile GitHub</h1>
      <Configuration />
      <BurndownChart />
    </GitHubContextProvider>
  </ErrorBoundary>
);

export default App;
