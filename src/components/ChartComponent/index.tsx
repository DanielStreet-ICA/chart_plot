import React, { useCallback } from 'react';
import { Chart } from 'react-charts';

interface MappedData {
  timeStamp: number;
  value: number;
}
interface SeriesData {
  key: string;
  data: MappedData[];
}
interface IProps {
  chartSeries: SeriesData[];
}
const ChartComponent: React.FC<IProps> = ({ chartSeries }: IProps) => {
  const axes = React.useMemo(
    () => [
      {
        primary: true,
        type: 'utc',
        position: 'bottom',
        innerPadding: '5',
        tickSizeInner: 0,
        showGrid: false,
      },
      { type: 'linear', position: 'left' },
    ],
    [],
  );

  const transformSeriesToChartData = useCallback(() => {
    const data: any[] = [];
    chartSeries.forEach((serie) => {
      const label = serie.key;
      const lineData = serie.data.map((element) => [
        new Date(element.timeStamp),
        element.value,
      ]);

      data.push({ label, data: lineData });
    });

    return data;
  }, [chartSeries]);
  const chartData = transformSeriesToChartData();
  console.log('chart data', chartData);
  return (
    <Chart
      styles={{ position: 'absolute' }}
      data={chartData}
      axes={axes}
      tooltip
    />
  );
};

export default ChartComponent;
