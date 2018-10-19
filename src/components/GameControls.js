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

  colorPicker = name => {
    return (
      <select name={name} onChange={this.handleChange}>
        <option value="white" style={{ backgoundColor: "white" }}>
          White
        </option>
        <option value="blue" style={{ backgoundColor: "blue" }}>
          Blue
        </option>
        <option value="green" style={{ backgoundColor: "green" }}>
          Green
        </option>
        <option value="red" style={{ backgoundColor: "red" }}>
          Red
        </option>
        <option value="purple" style={{ backgoundColor: "purple" }}>
          Purple
        </option>
      </select>
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
        p1: {this.colorPicker("p1Color")} p2: {this.colorPicker("p2Color")}
        <br />
        Points to win
        <input
          name="pointsToWin"
          value={this.state.pointsToWin}
          onChange={this.handleChange}
          placeholder="Points to win"
          type="number"
          style={{ display: "block" }}
        />
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
        Ball Color:{this.colorPicker("gameBallColor")}
      </div>
    );
  }
}

export default GameControls;
