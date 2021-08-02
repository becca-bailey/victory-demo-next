import { useQuery } from "urql";
import styles from "../../styles/Home.module.css";
import {
  VictoryChart,
  VictoryScatter,
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
  const router = useRouter();
  const { count } = router.query;
  const [{ error, fetching, data }] = useQuery({
    query,
    variables: {
      count: parseInt(count),
    },
  });

  return (
    <div className={styles.container}>
      {fetching && "Loading..."}
      {error && error.message}
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
