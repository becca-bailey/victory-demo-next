import { useQuery } from "urql";
import styles from "../styles/Home.module.css";
import {
  Point,
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";
import React, { Profiler } from "react";

const query = `
  {
    populationData {
      country
      values {
        year
        value
      }
    }
  }
`;

function formatBigNumber(n) {
  if (n >= 1_000_000_000) {
    return `${n / 1_000_000_000}B`;
  } else if (n >= 1_000_000) {
    return `${n / 1_000_000}M`;
  } else if (n >= 1_000) {
    return `${n / 1_000}K`;
  }
}

const ConditionalPoint = ({ active, ...rest }) => {
  if (!active) {
    return null;
  }
  return <Point {...rest} />;
};

const MemoizedTooltip = React.memo((props) => {
  return (
    <Profiler id="Tooltip" onRender={(...data) => console.log(data)}>
      <VictoryTooltip {...props} />
    </Profiler>
  );
});

export default function Population() {
  const [{ error, fetching, data }] = useQuery({
    query,
  });

  const populationData = data?.populationData;

  return (
    <div className={styles.container}>
      {fetching && "Loading..."}
      {populationData && (
        <VictoryChart
          height={250}
          containerComponent={<VictoryVoronoiContainer voronoiDimension="x" />}
          domain={{ x: [1960, 2020], y: [0, 7673533972] }}
        >
          {populationData.map(({ country, values }, i) => {
            return (
              <VictoryLine
                key={country}
                data={values.map(({ year, value }) => ({
                  x: year,
                  y: value && parseInt(value),
                  country,
                }))}
                // labels={({ datum }) => `${datum.country} - ${datum.y}`}
                // labelComponent={<MemoizedTooltip />}
              />
            );
          })}
          <VictoryAxis tickFormat={(value) => value.toString()} />
          <VictoryAxis
            dependentAxis
            tickFormat={(value) => formatBigNumber(value)}
          />
          {data.populationData.map(({ country, values }) => {
            return (
              <VictoryScatter
                key={country}
                data={values.map(({ year, value }) => ({
                  x: year,
                  y: value && parseInt(value),
                }))}
                dataComponent={<ConditionalPoint />}
              />
            );
          })}
        </VictoryChart>
      )}
    </div>
  );
}
