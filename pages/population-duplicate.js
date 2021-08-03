import { useQuery } from "urql";
import styles from "../styles/Home.module.css";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLineDuplicate as VictoryLine,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";
import React from "react";

const query = `
  query populationData($count: Int!) {
    populationData(count: $count) {
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

// const ConditionalPoint = ({ active, ...rest }) => {
//   if (!active) {
//     return null;
//   }
//   return <Point {...rest} />;
// };

const MemoizedTooltip = React.memo((props) => {
  return <VictoryTooltip {...props} />;
});

export default function Population() {
  const [{ error, fetching, data }] = useQuery({
    query,
    variables: { count: 50 },
  });

  const populationData = data?.populationData;

  console.error(error);

  return (
    <div className={styles.container}>
      {fetching && "Loading..."}
      {populationData && (
        <VictoryChart
          height={250}
          containerComponent={<VictoryVoronoiContainer />}
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
                labels={({ datum }) => `${datum.country} - ${datum.y}`}
                labelComponent={<MemoizedTooltip />}
              />
            );
          })}
          <VictoryAxis tickFormat={(value) => value.toString()} />
          <VictoryAxis
            dependentAxis
            tickFormat={(value) => formatBigNumber(value)}
          />
        </VictoryChart>
      )}
    </div>
  );
}
