import React from 'react';
import { Spinner } from 'nr1';
import GitHubContext from '../GitHubContext';
import { VictoryStack, VictoryArea } from 'victory';
import { prop } from '../utils/functional';

const todo = [
  { x: 'mon', y: 2 },
  { x: 'tues', y: 3 },
  { x: 'wed', y: 5 },
];

const inProgress = [
  { x: 'mon', y: 1 },
  { x: 'tues', y: 4 },
  { x: 'wed', y: 5 },
];

const forReview = [
  { x: 'mon', y: 1 },
  { x: 'tues', y: 4 },
  { x: 'wed', y: 5 },
];

const done = [
  { x: 'mon', y: 3 },
  { x: 'tues', y: 2 },
  { x: 'wed', y: 6 },
];

interface DataPoint {
  x: string;
  y: number;
}

interface ChartData {
  todo: DataPoint[];
  inProgress: DataPoint[];
  forReview: DataPoint[];
  done: DataPoint[];
}

interface ChartState {
  data: ChartData;
}

class Chart extends React.Component<null, ChartState> {
  constructor(props: null) {
    super(props);

    this.state = { data: null };
  }

  async componentDidMount(): Promise<void> {
    try {
      // TODO: fetch data
      // TODO: transform
      // TODO: set state
      this.setState({ data: { todo, inProgress, forReview, done } });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { data } = this.state;

    if (!data) {
      return null;
    }

    const { todo, inProgress, forReview, done } = data;

    // TODO: better labels
    // TODO: better colors
    // TODO: dynamic columns
    return (
      <GitHubContext.Consumer>
        {({ loading, data }) => {
          if (loading) {
            return <Spinner />;
          }

          console.log('loading', loading);
          console.log(data);

          return (
            <VictoryStack labels={todo.map(prop('x'))}>
              <VictoryArea data={todo} />
              <VictoryArea data={inProgress} />
              <VictoryArea data={forReview} />
              <VictoryArea data={done} />
            </VictoryStack>
          );
        }}
      </GitHubContext.Consumer>
    );
  }
}

export default Chart;