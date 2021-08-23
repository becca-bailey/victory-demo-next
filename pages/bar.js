import { useQuery } from "urql";
import styles from "../styles/Home.module.css";
import {
  VictoryBar,
  VictoryChart,
  VictoryStack,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";
import React from "react";
import { useRouter } from "next/router";
import { parseBool } from "../utilities/parseBool";

const query = `
  query randomGroups($count: Int!, $groups: Int, $multiplier: Int) {
    randomGroups(count: $count, groups: $groups, multiplier: $multiplier) {
      x
      y
    }
  }
`;

export default function Bar() {
  const router = useRouter();
  const {
    count = 0,
    multiplier = 1,
    groups = 1,
    animate: animateString,
  } = router.query;
  const animate = parseBool(animateString);
  const [{ error, fetching, data }] = useQuery({
    query,
    variables: {
      count: parseInt(count),
      groups: parseInt(groups),
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
          // domain={{ x: [0, multiplier], y: [0, multiplier] }}
        >
          <VictoryStack animate={animate} colorScale="qualitative">
            {data.randomGroups.map((group, i) => {
              return (
                <VictoryBar
                  data={group}
                  key={i}
                  labels={group.map(({ y }) => y)}
                  labelComponent={<VictoryTooltip />}
                ></VictoryBar>
              );
            })}
          </VictoryStack>
        </VictoryChart>
      )}
    </div>
  );
}
