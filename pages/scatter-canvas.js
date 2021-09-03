import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "urql";
import { VictoryScatter, VictoryChart } from "victory";
import styles from "../styles/Home.module.css";

const query = `
  query RandomXY($count: Int!, $multiplier: Int) {
    randomXY(count: $count, multiplier: $multiplier) {
      x
      y
    }
  }
`;

const CanvasContext = React.createContext();

function useCanvasRef() {
  const context = React.useContext(CanvasContext);
  return context;
}

function CanvasContainer({ width, height, children }) {
  const canvasRef = React.useRef();

  return (
    <CanvasContext.Provider value={canvasRef}>
      <canvas width={width} height={height} ref={canvasRef} />
      {children}
    </CanvasContext.Provider>
  );
}

CanvasContainer.role = "container";

function CanvasPoint({ x, y }) {
  const canvasRef = useCanvasRef();

  const draw = (ctx) => {
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fill();
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    draw(context);
  }, [canvasRef]);

  return null;
}

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
        <VictoryScatter
          height={750}
          width={1200}
          containerComponent={<CanvasContainer />}
          data={data.randomXY}
          dataComponent={<CanvasPoint />}
        />
      )}
    </div>
  );
}
