import React from "react";
import {
  VictoryChart,
  VictoryGroup,
  VictoryVoronoiContainer,
  VictoryLine,
} from "victory";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import { useQuery } from "urql";

const query = `
  query randomGroups($count: Int!, $groups: Int, $multiplier: Int) {
    randomGroups(count: $count, groups: $groups, multiplier: $multiplier) {
      x
      y
    }
  }
`;

export default function Line() {
  const router = useRouter();
  const {
    count = 0,
    multiplier = 1,
    groups = 1,
    animate = false,
  } = router.query;
  const [{ error, fetching, data }, reexecuteQuery] = useQuery({
    query,
    variables: {
      count: parseInt(count),
      groups: parseInt(groups),
      multiplier: parseInt(multiplier),
    },
    enbled: !!count,
    requestPolicy: "network-only",
  });

  return (
    <div className={styles.container}>
      {fetching && "Loading..."}
      {error && error.message}
      <VictoryChart
        containerComponent={
          <VictoryVoronoiContainer labels={({ datum }) => `${datum.y}`} />
        }
      >
        <VictoryGroup animate={animate}>
          {data?.randomGroups.map((dataSet, i) => (
            <VictoryLine key={i} data={dataSet} />
          ))}
        </VictoryGroup>
      </VictoryChart>
    </div>
  );
}
