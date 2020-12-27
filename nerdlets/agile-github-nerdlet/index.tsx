import React from "react";
import { GitHubContextProvider } from '../../src/GitHubContext';
import Chart from '../../src/components/Chart';

const App: React.FC = () => (
  <GitHubContextProvider token="abc123">
    <h1>Agile GitHub</h1>
    <Chart />
  </GitHubContextProvider>
);

export default App;
