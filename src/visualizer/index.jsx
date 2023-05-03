import { observer } from "mobx-react-lite";
import { useRef } from "react";
import store, { positions } from "./store";

const Ball = observer(({ ball }) => {
  return (
    <div
      style={{
        background: ball.color,
        borderRadius: "50%",
        height: "5vh",
        width: "5vh",
        boxShadow: "3px 3px 0px #005b95",
      }}
    />
  );
});

const Queue = observer(({ queue, position }) => {
  const style =
    position === positions.left
      ? {
          left: "16vh",
        }
      : { right: "16vh" };
  return (
    <div
      style={{
        zIndex: 100,
        width: "28vh",
        height: "90vh",
        // background: "#a8a8a9",
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        transition: "all 0.3s",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // boxShadow: "3px 3px 0px #005b95",
        ...style,
      }}
    >
      {queue.topBalls.map((ball) => (
        <Ball ball={ball} />
      ))}
      <div style={{ height: "20vh" }}></div>
      {queue.botBalls.map((ball) => (
        <Ball ball={ball} />
      ))}
    </div>
  );
});

const Bridge = observer(() => {
  const style =
    store.bridge.position === positions.left
      ? {
          left: "20vh",
        }
      : { left: "50vh" };
  return (
    <div
      style={{
        zIndex: 1000,
        width: "20vh",
        height: "20vh",
        // background: "#d2d2d3",
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        transition: "all 0.3s",
        borderRadius: "25%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0px 0px 15px #005b95",
        ...style,
      }}
    >
      {store.bridge.balls.map((ball) => (
        <Ball ball={ball} />
      ))}
    </div>
  );
});

const Toy = observer(() => {
  return (
    <div
      style={{
        height: "90vh",
        width: "90vh",
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%,-50%)",
        display: "flex",
      }}
    >
      <Queue queue={store.leftQueue} position={positions.left} />
      <Queue queue={store.rightQueue} position={positions.right} />
      <Bridge />
    </div>
  );
});

const KeyInput = observer(() => {
  const inputRef = useRef(null);
  const keyDownHandler = ({ code }) => {
    store.keyDown(code);
  };
  return (
    <div
      style={{
        position: "absolute",
        opacity: 0,
      }}
    >
      <input
        ref={inputRef}
        onBlur={() => inputRef.current.focus()}
        autoFocus
        onKeyDown={keyDownHandler}
      />
    </div>
  );
});

export const Visualizer = observer(() => {
  return (
    <div event style={{ background: "#ededed", width: "100vw", height: "100vh" }}>
      <KeyInput />
      <Toy />
    </div>
  );
});
