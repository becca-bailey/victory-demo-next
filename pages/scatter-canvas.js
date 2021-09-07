import { isEqual } from "lodash";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "urql";
import { VictoryScatter, VictoryChart, VictoryAxis } from "victory";
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
  const [mousePosition, setMousePosition] = React.useState({});

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const onMouseMove = (event) => {
      const { left, top } = canvas.getBoundingClientRect();
      const mousePosition = {
        x: event.clientX - left,
        y: event.clientY - top,
      };
    };
    canvas.addEventListener("mousemove", onMouseMove);

    return () => canvas.removeEventListener("mousemove", onMouseMove);
  }, [canvasRef]);

  return (
    <CanvasContext.Provider value={{ canvasRef, mousePosition }}>
      <canvas width={width} height={height} ref={canvasRef} />
      {children}
    </CanvasContext.Provider>
  );
}

CanvasContainer.role = "container";

function CanvasPoint({ x, y, fill, size = 2 }) {
  const { canvasRef, mousePosition } = useCanvasRef();

  const isHovering = isEqual({ x, y }, mousePosition);

  const draw = (ctx) => {
    ctx.fillStyle = isHovering ? "yellow" : fill;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill();
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    draw(context);
  }, [canvasRef]);

  return null;
}

function Group({ children }) {
  return children;
}

function CanvasLineSegment({ x1, x2, y1, y2 }) {
  const { canvasRef } = useCanvasRef();

  const draw = (ctx) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    draw(context);
  }, [canvasRef]);

  return null;
}

function CanvasLabel({ datum, style, horizontal, x, y }) {
  const font = `${style.fontSize}px ${style.fontFamily}`;
  const { canvasRef } = useCanvasRef();

  const draw = (ctx) => {
    ctx.font = font;
    ctx.fillText(datum, x, y);
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    draw(context);
  }, [canvasRef]);

  return null;
}

CanvasLabel.role = "label";

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
          height={750}
          width={1200}
          containerComponent={<CanvasContainer />}
        >
          <VictoryAxis
            groupComponent={<Group />}
            tickLabelComponent={<CanvasLabel />}
            axisComponent={<CanvasLineSegment />}
          />
          <VictoryAxis
            dependentAxis
            groupComponent={<Group />}
            axisComponent={<CanvasLineSegment />}
            tickLabelComponent={<CanvasLabel />}
          />
          <VictoryScatter
            data={data.randomXY}
            dataComponent={<CanvasPoint fill="teal" size={5} />}
            groupComponent={<Group />}
          />
        </VictoryChart>
      )}
    </div>
  );
}
