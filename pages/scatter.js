import { useQuery } from "urql";
import styles from "../styles/Home.module.css";
import {
  VictoryChart,
  VictoryScatter,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";
import React, { Profiler } from "react";

const query = `
  query RandomXY($count: Int!) {
    randomXY(count: $count) {
      x
      y
    }
  }
`;

const MemoizedTooltip = React.memo((props) => {
  // if (!props.active) {
  //   return null;
  // }
  return <VictoryTooltip {...props} />;
});

export default function Scatter() {
  const [{ error, fetching, data }] = useQuery({
    query,
    variables: {
      count: 1000,
    },
  });

  return (
    <div className={styles.container}>
      {fetching && "Loading..."}
      {data && (
        <VictoryChart
          containerComponent={<VictoryVoronoiContainer />}
          domain={{ x: [0, 1], y: [0, 1] }}
        >
          <VictoryScatter
            data={data.randomXY}
            labelComponent={<MemoizedTooltip />}
            labels={data.randomXY.map(({ x, y }) => [x, y])}
          />
        </VictoryChart>
      )}
    </div>
  );
}
