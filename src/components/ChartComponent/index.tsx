import React, { useCallback, useEffect } from 'react';
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

  useEffect(() => {
    // sadly there the chart x axe was overflowing the container
    // this tricky code solves the problem
    const chart: any = document.getElementById('Chart')?.childNodes[0];
    chart.style.overflow = 'visible';
  }, []);
  return (
    <>
      <Chart
        styles={{ position: 'absolute' }}
        data={chartData}
        axes={axes}
        tooltip
        id="Chart"
      />
    </>
  );
};

export default ChartComponent;
