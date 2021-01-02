import React from "react";
import { Grid, GridItem } from 'nr1';
import ErrorBoundary from '../../src/ErrorBoundary';
import { GitHubContextProvider } from '../../src/GitHubContext';
import BurndownChart from '../../src/components/BurndownChart';
import Configuration from '../../src/components/Configuration';

const App: React.FC = () => (
  <ErrorBoundary>
    <GitHubContextProvider>
      <Grid>
        <GridItem columnSpan={12}>
          <h1>Agile GitHub</h1>
        </GridItem>
        <GridItem columnSpan={3}>
          <Configuration />
        </GridItem>
        <GridItem columnSpan={9}>
          <BurndownChart />
        </GridItem>
      </Grid>
    </GitHubContextProvider>
  </ErrorBoundary>
);

export default App;
