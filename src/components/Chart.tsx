import React from 'react';
import { Spinner } from 'nr1';
import { VictoryStack, VictoryArea } from 'victory';
import format from 'date-fns/fp/format';
import GitHubContext from '../GitHubContext';
import { prop } from '../utils/functional';
import { PointsForDay } from '../utils/issues';

interface DataPoint {
  x: string;
  y: number;
}

const dayToData = (columnIndex: number) => (day: PointsForDay): DataPoint => ({
  x: format('M/d', day.date),
  y: day.columns[columnIndex].points
});

const transformData = (data: PointsForDay[]): Record<string, DataPoint[]> => {
  return data[0].columns
    .map(prop('label'))
    .reduce((acc, label, index) => {
      return {
        ...acc,
        [label]: data.map(dayToData(index))
      }
    }, {});
}

// TODO: rename to burndown
const Chart: React.FC = () => (
  <GitHubContext.Consumer>
    {({ loading, data }) => {
      if (loading) return <Spinner />;

      const labels = data.map(prop('date')).map(format('M/d'));
      const transformedData = transformData(data);

      // TODO: fix the busted chart
      return (
        <VictoryStack labels={labels}>
          {Object.entries(transformedData).map(([label, dataPoints]) => (
            <VictoryArea key={label} data={dataPoints} />
          ))}
        </VictoryStack>
      );
    }}
  </GitHubContext.Consumer>
);

export default Chart;