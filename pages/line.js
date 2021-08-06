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

const UPDATE_INTERVAL = 3; // seconds

const query = `
  query RandomBarGroups($count: Int!, $groups: Int, $multiplier: Int) {
    randomBarGroups(count: $count, groups: $groups, multiplier: $multiplier) {
      x
      y
    }
  }
`;

export default function Line() {
  const router = useRouter();
  const { count = 0, multiplier = 1, groups = 1 } = router.query;
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
  // const [timer, setTimer] = React.useState(UPDATE_INTERVAL * 1000);

  // // Update to a new collection of datasets on an interval.
  // React.useEffect(() => {
  //   const timerInterval = setInterval(() => {
  //     setTimer((current) => current - 1000);
  //   }, 1000);
  //   const dataInterval = setInterval(() => {
  //     reexecuteQuery({ requestPolicy: "network-only" });
  //     setTimer(UPDATE_INTERVAL * 1000);
  //   }, UPDATE_INTERVAL * 1000);
  //   return () => {
  //     clearInterval(dataInterval);
  //     clearInterval(timerInterval);
  //   };
  // }, []);

  return (
    <div className={styles.container}>
      {fetching && "Loading..."}
      {error && error.message}
      {/* <h1>{timer / 1000}</h1> */}
      <VictoryChart
        containerComponent={
          <VictoryVoronoiContainer labels={({ datum }) => `${datum.y}`} />
        }
      >
        <VictoryGroup>
          {data?.randomBarGroups.map((dataSet, i) => (
            <VictoryLine key={i} data={dataSet} />
          ))}
        </VictoryGroup>
      </VictoryChart>
    </div>
  );
}
