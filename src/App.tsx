import React, { useCallback, useEffect, useState } from 'react';
import * as durableJson from 'durable-json-lint';
import ChartComponent from './components/ChartComponent';
import logo from './logo.svg';
import Input from './components/Input';
import GlobalStyle from './styles/global';
import { ChartContainer, Content, MainContainer } from './AppStyle';
import Header from './components/Header';
import Footer from './components/Footer';

interface ChartWindow {
  begin: number;
  end: number;
}
interface MappedData {
  timeStamp: number;
  value: number;
}
interface SeriesData {
  key: string;
  data: MappedData[];
}
const App: React.FC = () => {
  // const [parsedData, setParsedData] = useState<any[]>([]);
  // const [userInput, setUserInput] = useState('');
  const [dataLoading, setDataLoading] = useState(false);
  const [chartSeries, setChartSeries] = useState<SeriesData[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartWindow, setChartWindow] = useState<ChartWindow | undefined>(
    undefined,
  );
  // const [fields, setFields] = useState<string[]>([]);
  // const [group, setGroup] = useState<string[]>([]);

  // const updateUserInput = useCallback((value: string) => {
  //   setUserInput(value);
  // }, []);
  const parseUserInput = useCallback((userInput: string) => {
    // first split the lines of user input
    const splittedUserInput = userInput.split('\n');
    setChartLoading(true);
    const parsedInput: React.SetStateAction<any[]> = [];
    try {
      // eslint-disable-next-line consistent-return
      splittedUserInput.forEach((split) => {
        let json: JSON;
        // then we check if it is something like a json object
        if (split.startsWith('{') && split.endsWith('}')) {
          // durable json is a package that handle non strict json inputs
          json = JSON.parse(durableJson(split).json);
          // if we cant parse some data, return and notify user
          if (json === null) {
            alert('Há inputs inválidos');
            return null;
          }
          // if its valid push it to the array
          parsedInput.push(json);
        }
      });
    } catch {
      // if we have troubles...
      alert('Há inputs inválidos');
      return null;
    }
    return parsedInput;
  }, []);

  const getDateFromTimeStamp = (timeStamp: number) => {
    console.log('timestring', timeStamp);
    const date = new Date(timeStamp);
    console.log('parseddate', date);
    return date;
  };

  const handleStartEvent = useCallback((event) => {
    const selectedFields: string[] = event.select;
    const selectedGroups: string[] = event.group;
    return { fields: selectedFields, groups: selectedGroups };
  }, []);

  const handleSpanEvent = useCallback((event) => {
    const { begin } = event;
    const { end } = event;
    return { begin, end };
  }, []);

  const mapFieldsToKey = (groups: string[], values: any[]) => {
    const mapped: { key: string; data: MappedData }[] = [];
    // first we join the groups of the data to generate a key
    // for diferent series
    const mappedGroups = groups.join('.');

    // now we do the samething for values
    // and return a data object (MappedData)
    values.forEach((value) => {
      const key = mappedGroups.concat(`.${value.key}`);
      mapped.push({
        key,
        data: { timeStamp: value.timeStamp, value: value.value },
      });
    });

    return mapped;
  };
  const handleDataEvent = useCallback(
    (
      event,
      fields: string[],
      groups: string[],
    ): { key: string; data: MappedData }[] => {
      const fieldsArray: any[] = [];
      const groupArray: string[] = [];
      // map de value and timestamp for each field
      fields.forEach((element) => {
        fieldsArray.push({
          key: element,
          timeStamp: event.timestamp,
          value: event[element],
        });
      });
      // map the event groups
      groups.forEach((element) => {
        groupArray.push(event[element]);
      });

      // map data into a key name line
      const newData = mapFieldsToKey(groupArray, fieldsArray);
      return newData;
    },

    [],
  );

  const getLastStartEventIndexFromParsedData = useCallback(
    (parsedData: any[]) => {
      let lastStartEventIndex = -1;
      try {
        // get the last start event on the input
        lastStartEventIndex = parsedData
          .map((element) => element.type)
          .lastIndexOf('start');
      } catch {
        alert(
          'Não foram encontrados eventos do tipo start definidos no input.',
        );
      }
      return lastStartEventIndex;
    },
    [],
  );
  const startChartData = useCallback(() => {
    // using this to avoid updating state in every
    // text change
    const userInput = document.getElementById('user_input_text');
    // check if is a valid input
    if (
      userInput == null ||
      userInput?.textContent === null ||
      userInput?.textContent === ''
    )
      return;

    // Try parse, return if there are parse problems
    const parsedData = parseUserInput(userInput?.textContent);
    console.log('parse', parsedData);
    if (parsedData === null || parsedData.length === 0) return;

    const lastStartEventIndex = getLastStartEventIndexFromParsedData(
      parsedData,
    );

    // if there's no start event on input, return
    if (lastStartEventIndex === -1) return;

    // handle the last start event
    const { fields, groups } = handleStartEvent(
      parsedData[lastStartEventIndex],
    );

    const series: SeriesData[] = [];
    let window: { begin: any; end: any } | undefined;

    // iterate on the events that follows the last start event
    // and handle the different types of events
    // eslint-disable-next-line no-plusplus
    for (let i = lastStartEventIndex; i < parsedData.length; i++) {
      if (parsedData[i].type === 'stop') break;
      if (parsedData[i].type === 'span') {
        window = handleSpanEvent(parsedData[i]);
      }

      if (parsedData[i].type === 'data') {
        const newData = handleDataEvent(parsedData[i], fields, groups);

        // first check if the data is inside window bounds
        // eslint-disable-next-line no-loop-func
        newData.forEach((data) => {
          if (window !== undefined) {
            if (
              data.data.timeStamp < window.begin ||
              data.data.timeStamp > window.end
            ) {
              console.log('fora', data.data.timeStamp);
              return;
            }
          }
          // check if the corresponding line is already in the series
          const index = series.map((element) => element.key).indexOf(data.key);
          if (index !== -1) {
            // if we already have this line, check if it's not a repetead value
            // if it's not push the new value to the series
            if (
              !series[index].data.find(
                (element) =>
                  element.value === data.data.value &&
                  element.timeStamp === data.data.timeStamp,
              )
            )
              series[index].data.push(data.data);
          }
          // if we don't have the corresponding line, create a new line
          else {
            series.push({ key: data.key, data: [data.data] });
          }
        });
      }
    }

    // set the data
    setChartSeries(series);
  }, [
    getLastStartEventIndexFromParsedData,
    handleDataEvent,
    handleSpanEvent,
    handleStartEvent,
    parseUserInput,
  ]);

  useEffect(() => {
    console.log('chart', chartSeries);
  }, [chartSeries]);

  return (
    <>
      <Content>
        <Header />
        <MainContainer>
          <Input />

          <ChartContainer>
            <ChartComponent chartSeries={chartSeries} />
          </ChartContainer>
        </MainContainer>
        <GlobalStyle />
        <Footer>
          <button onClick={startChartData} type="button">
            Generate Chart{' '}
          </button>
        </Footer>
      </Content>
    </>
  );
};

export default App;
