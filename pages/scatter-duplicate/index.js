import { useQuery } from "urql";
import styles from "../../styles/Home.module.css";
import {
  VictoryChart,
  VictoryScatterDuplicate,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";
import React from "react";
import { useRouter } from "next/router";

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
      count: 2000,
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
          <VictoryScatterDuplicate
            data={data.randomXY}
            labelComponent={<MemoizedTooltip />}
            labels={data.randomXY.map(({ x, y }) => [x, y])}
          />
        </VictoryChart>
      )}
    </div>
  );
}
