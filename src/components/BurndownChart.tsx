import React from 'react';
import { Spinner } from 'nr1';
import { VictoryStack, VictoryArea } from 'victory';
import format from 'date-fns/fp/format';
import GitHubContext from '../GitHubContext';
import { prop } from '../utils/functional';

interface IDataPoint {
  x: string;
  y: number;
}

const dayToData = (columnIndex: number) => (day: IGitHubData): IDataPoint => ({
  x: format('M/d', day.date),
  y: day.columns[columnIndex].points
});

const transformData = (data: IGitHubData[]): Record<string, IDataPoint[]> => {
  return data[0].columns
    .map(prop('label'))
    .reduce((acc, label, index) => {
      return {
        ...acc,
        [label]: data.map(dayToData(index))
      }
    }, {});
}

const BurndownChart: React.FC = () => (
  <GitHubContext.Consumer>
    {({ loading, data }) => {
      if (loading) return <Spinner />;
      if (!data.length) return null;

      const labels = data.map(prop('date')).map(format('M/d'));
      const burndownData = transformData(data);

      return (
        <VictoryStack labels={labels}>
          {Object.entries(burndownData).map(([label, dataPoints]) => (
            <VictoryArea key={label} data={dataPoints} />
          ))}
        </VictoryStack>
      );
    }}
  </GitHubContext.Consumer>
);

export default BurndownChart;