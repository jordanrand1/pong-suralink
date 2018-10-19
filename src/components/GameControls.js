import React from "react";

class GameControls extends React.Component {
  state = {
    pointsToWin: 5,
    gameBallColor: "white",
    ballVelocity: 1,
    p1Color: "white",
    p2Color: "white"
  };

  render() {
    return (
      <div>
        <button onClick={() => this.props.start(this.state)}>Start</button>
      </div>
    );
  }
}

export default GameControls;
