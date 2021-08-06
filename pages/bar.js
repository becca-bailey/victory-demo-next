import { useQuery } from "urql";
import styles from "../styles/Home.module.css";
import {
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";
import React from "react";
import { useRouter } from "next/router";

const query = `
  query RandomBarGroups($count: Int!, $groups: Int, $multiplier: Int) {
    randomBarGroups(count: $count, groups: $groups, multiplier: $multiplier) {
      x
      y
    }
  }
`;

export default function Bar() {
  const router = useRouter();
  const { count = 0, multiplier = 1, groups = 1 } = router.query;
  const [{ error, fetching, data }] = useQuery({
    query,
    variables: {
      count: parseInt(count),
      groups: parseInt(groups),
      multiplier: parseInt(multiplier),
    },
    enbled: !!count,
  });

  console.log(data);

  return (
    <div className={styles.container}>
      {fetching && "Loading..."}
      {error && error.message}
      {data && (
        <VictoryChart
          containerComponent={<VictoryVoronoiContainer />}
          // domain={{ x: [0, multiplier], y: [0, multiplier] }}
        >
          <VictoryGroup colorScale="qualitative">
            {data.randomBarGroups.map((group, i) => {
              return (
                <VictoryBar
                  data={group}
                  key={i}
                  labels={group.map(({ y }) => y)}
                  labelComponent={<VictoryTooltip />}
                ></VictoryBar>
              );
            })}
          </VictoryGroup>
        </VictoryChart>
      )}
    </div>
  );
}
