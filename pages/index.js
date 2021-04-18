import { useQuery } from "urql";
import styles from "../styles/Home.module.css";
import {
  Point,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryVoronoiContainer,
} from "victory";

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

const ConditionalPoint = ({ active, ...rest }) => {
  if (!active) {
    return null;
  }
  return <Point {...rest} />;
};

export default function Home() {
  const [{ error, fetching, data }] = useQuery({
    query,
  });

  return (
    <div className={styles.container}>
      {fetching && "Loading..."}
      {data && (
        <VictoryChart
          containerComponent={<VictoryVoronoiContainer voronoiDimension="x" />}
        >
          {data.populationData.map(({ country, values }) => {
            return (
              <VictoryLine
                key={country}
                data={values.map(({ year, value }) => ({
                  x: year,
                  y: value && parseInt(value),
                }))}
              />
            );
          })}
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
