import { useQuery } from "urql";
import styles from "../styles/Home.module.css";
import {
  VictoryChart,
  VictoryScatterDuplicate as VictoryScatter,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";
import React from "react";
import { useRouter } from "next/router";

const query = `
  query RandomXY($count: Int!, $multiplier: Int) {
    randomXY(count: $count, multiplier: $multiplier) {
      x
      y
    }
  }
`;

const MemoizedTooltip = React.memo((props) => {
  return <VictoryTooltip {...props} />;
});

export default function Scatter() {
  const router = useRouter();
  const { count = 0, multiplier = 1 } = router.query;
  const [{ error, fetching, data }] = useQuery({
    query,
    variables: {
      count: parseInt(count),
      multiplier: parseInt(multiplier),
    },
    enbled: !!count,
  });

  return (
    <div className={styles.container}>
      {fetching && "Loading..."}
      {error && error.message}
      {data && (
        <VictoryChart
          containerComponent={<VictoryVoronoiContainer />}
          domain={{ x: [0, multiplier], y: [0, multiplier] }}
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
