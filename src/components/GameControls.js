import React from "react";

class GameControls extends React.Component {
  state = {
    pointsToWin: 5,
    gameBallColor: "white",
    ballVelocity: 1,
    p1Color: "white",
    p2Color: "white"
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  input = (name, value, placeholder, type) => {
    return (
      <input
        name={name}
        value={value}
        onChange={this.handleChange}
        placeholder={placeholder}
        type={type}
        style={{ display: "block" }}
      />
    );
  };

  render() {
    return (
      <div style={{ color: "white", backgound: "#000" }}>
        <button
          onClick={() => this.props.start(this.state)}
          style={{ display: "block" }}
        >
          Start
        </button>
        p1:{" "}
        {this.input(
          "p1Color",
          this.state.p1Color,
          "Player 1 color (hex)",
          "text"
        )}
        p2:{" "}
        {this.input(
          "p2Color",
          this.state.p2Color,
          "Player 2 color (hex)",
          "text"
        )}
        Points to win
        {this.input(
          "pointsToWin",
          this.state.pointsToWin,
          "Points to win:",
          "number"
        )}
        Ball Velocity:
        <input
          name="ballVelocity"
          value={this.state.ballVelocity}
          onChange={this.handleChange}
          placeholder="ballVelocity"
          type="number"
          style={{ display: "block" }}
          min="1"
          max="3"
        />
        Ball Color:{" "}
        {this.input(
          "gameBallColor",
          this.state.gameBallColor,
          "Ball color (hex)",
          "text"
        )}
      </div>
    );
  }
}

export default GameControls;
