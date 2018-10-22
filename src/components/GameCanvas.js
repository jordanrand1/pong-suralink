import React, { Component } from "react";
import GameControls from "./GameControls";

class GameCanvas extends Component {
  state = {
    pointsToWin: 5,
    playing: false,
    gameBallColor: "white",
    ballVelocity: 1,
    deadBalls: [],
    p1Color: "white",
    p2Color: "white",
    api: {}
  };

  _initializeGameCanvas = () => {
    // initialize canvas element and bind it to our React class
    this.canvas = this.refs.pong_canvas;
    this.ctx = this.canvas.getContext("2d");

    // declare initial variables
    this.p1Score = 0;
    this.p2Score = 0;
    this.keys = {};

    // add keyboard input listeners to handle user interactions
    window.addEventListener("keydown", e => {
      this.keys[e.keyCode] = 1;
      if (e.target.nodeName !== "INPUT") e.preventDefault();
    });
    window.addEventListener("keyup", e => delete this.keys[e.keyCode]);

    //faking the data from api, would destructure with this.state.api.data.gameData
    const paddle1 = {
      width: 10,
      height: 80,
      color: "#000",
      velocityY: 5
    };

    const paddle2 = {
      width: 10,
      height: 80,
      color: "#000",
      velocityY: 5
    };

    const ball = {
      width: 10,
      height: 10,
      color: "#000",
      velocityX: 2,
      velocityY: 2
    };

    // instantiate our game elements
    this.player1 = new this.GameClasses.Box({
      x: 10,
      y: 200,
      width: paddle1.width || 15,
      height: paddle1.height || 80,
      color: paddle1.color || this.state.p1Color,
      velocityY: paddle1.velocityY || 2
    });
    this.player2 = new this.GameClasses.Box({
      x: 725,
      y: 200,
      width: paddle2.width || 15,
      height: paddle2.height || 80,
      color: paddle2.color || this.state.p1Color,
      velocityY: paddle2.velocityY || 2
    });
    this.boardDivider = new this.GameClasses.Box({
      x: this.canvas.width / 2 - 2.5,
      y: -1,
      width: 5,
      height: this.canvas.height + 1,
      color: "#FFF"
    });
    this.gameBall = new this.GameClasses.Box({
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      width: ball.width || 15,
      height: ball.height || 15,
      color: ball.color || this.state.gameBallColor,
      velocityX: ball.velocityX || -this.state.ballVelocity,
      velocityY: ball.velocityY || this.state.ballVelocity
    });
  };

  // recursively process game state and redraw canvas
  _renderLoop = () => {
    this._ballCollisionY();
    this._userInput(this.player1);
    this._userInput(this.player2);
    this.frameId = window.requestAnimationFrame(this._renderLoop);
  };

  // watch ball movement in Y dimension and handle top/bottom boundary collisions, then call _ballCollisionX
  _ballCollisionY = () => {
    if (
      this.gameBall.y + this.gameBall.velocityY <= 0 ||
      this.gameBall.y + this.gameBall.velocityY + this.gameBall.height >=
        this.canvas.height
    ) {
      this.gameBall.velocityY = this.gameBall.velocityY * -1;
      this.gameBall.x += this.gameBall.velocityX;
      this.gameBall.y += this.gameBall.velocityY;
    } else {
      this.gameBall.x += this.gameBall.velocityX;
      this.gameBall.y += this.gameBall.velocityY;
    }
    this._ballCollisionX();
  };

  // watch ball movement in X dimension and handle paddle collisions and score setting/ball resetting, then call _drawRender
  _ballCollisionX = () => {
    if (
      (this.gameBall.x + this.gameBall.velocityX <=
        this.player1.x + this.player1.width &&
        this.gameBall.y + this.gameBall.velocityY > this.player1.y &&
        this.gameBall.y + this.gameBall.velocityY <=
          this.player1.y + this.player1.height) ||
      (this.gameBall.x + this.gameBall.width + this.gameBall.velocityX >=
        this.player2.x &&
        this.gameBall.y + this.gameBall.velocityY > this.player2.y &&
        this.gameBall.y + this.gameBall.velocityY <=
          this.player2.y + this.player2.height)
    ) {
      this.gameBall.velocityX = this.gameBall.velocityX * -1;
    } else if (
      this.gameBall.x + this.gameBall.velocityX <
      this.player1.x - 15
    ) {
      this.p2Score += 1;
      this.checkScore();
      this.state.deadBalls.push(this.gameBall);
      this.gameBall = new this.GameClasses.Box({
        x: this.canvas.width / 2,
        y: this.canvas.height / 2,
        width: 15,
        height: 15,
        color: `${this.state.gameBallColor}`,
        velocityX: -this.state.ballVelocity,
        velocityY: this.state.ballVelocity
      });
    } else if (
      this.gameBall.x + this.gameBall.velocityX >
      this.player2.x + this.player2.width
    ) {
      this.p1Score += 1;
      this.checkScore();
      console.log(this.state.ballVelocity);
      this.state.deadBalls.push(this.gameBall);
      this.gameBall = new this.GameClasses.Box({
        x: this.canvas.width / 2,
        y: this.canvas.height / 2,
        width: 15,
        height: 15,
        color: `${this.state.gameBallColor}`,
        velocityX: this.state.ballVelocity,
        velocityY: this.state.ballVelocity
      });
    } else {
      this.gameBall.x += this.gameBall.velocityX;
      this.gameBall.y += this.gameBall.velocityY;
    }
    this._drawRender();
  };

  // clear canvas and redraw according to new game state
  _drawRender = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this._displayScore1();
    this._displayScore2();
    this._drawBox(this.player1);
    this._drawBox(this.player2);
    this._drawBox(this.boardDivider);
    this._drawBox(this.gameBall);
  };

  // take in game object and draw to canvas
  _drawBox = box => {
    this.ctx.fillStyle = box.color;
    this.ctx.fillRect(box.x, box.y, box.width, box.height);
  };

  // render player 1 score
  _displayScore1 = () => {
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "rgb(255, 255, 255)";
    this.ctx.fillText(
      this.p1Score,
      this.canvas.width / 2 - (this.p1Score > 9 ? 55 : 45),
      30
    );
  };

  // render player 2 score
  _displayScore2 = () => {
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "rgb(255, 255, 255)";
    this.ctx.fillText(this.p2Score, this.canvas.width / 2 + 33, 30);
  };

  //track user input
  _userInput = () => {
    if (87 in this.keys) {
      if (this.player1.y - this.player1.velocityY > 0)
        this.player1.y -= this.player1.velocityY;
    } else if (83 in this.keys) {
      if (
        this.player1.y + this.player1.height + this.player1.velocityY <
        this.canvas.height
      )
        this.player1.y += this.player1.velocityY;
    }

    if (38 in this.keys) {
      if (this.player2.y - this.player2.velocityY > 0)
        this.player2.y -= this.player2.velocityY;
    } else if (40 in this.keys) {
      if (
        this.player2.y + this.player2.height + this.player2.velocityY <
        this.canvas.height
      )
        this.player2.y += this.player2.velocityY;
    }
  };

  GameClasses = (() => {
    return {
      Box: function Box(opts) {
        let { x, y, width, height, color, velocityX, velocityY } = opts;
        this.x = x || 10;
        this.y = y || 10;
        this.width = width || 40;
        this.height = height || 50;
        this.color = color || "#FFF";
        this.velocityX = velocityX || 2;
        this.velocityY = velocityY || 2;
      }
    };
  })();

  //response does not have the game data
  apiCall = () => {
    fetch("https://wwwforms.suralink.com/pong.php?accessToken=pingPONG").then(
      res => {
        this.setState(
          {
            api: res
          },
          () => {
            // I would set delay to the newDelay which would be in state, for now it defaults to 6s
            let delay = this.state.api.data || 6000;
            console.log("api call");
            setTimeout(this.apiCall, delay);
          }
        );
      }
    );
    console.log("Called before Fetch");
  };

  startGame = options => {
    console.log(options);
    const {
      gameBallColor,
      ballVelocity,
      pointsToWin,
      p1Color,
      p2Color
    } = options;
    if (this.state.playing === false) {
      this.setState(
        {
          gameBallColor,
          playing: true,
          ballVelocity: Number(ballVelocity),
          pointsToWin: Number(pointsToWin),
          p1Color,
          p2Color
        },
        () => {
          this._initializeGameCanvas();
          this._renderLoop();
          this.apiCall();
        }
      );
    }
  };

  checkScore = () => {
    if (this.p1Score === this.state.pointsToWin) {
      console.log("P1 WINNER");
      //not ideal, I wasn't suer how to close the renderloop. I tried cancelAnimation
      location.reload();
    } else if (this.p2Score === this.state.pointsToWin) {
      console.log("P2 WINNER");
      //not ideal but works
      location.reload();
    }
  };

  render() {
    return (
      <>
        <canvas
          id="pong_canvas"
          ref="pong_canvas"
          width="750"
          height="500"
          style={{ background: "#12260e", border: "4px solid #FFF" }}
        />
        <GameControls start={this.startGame} />
      </>
    );
  }
}

export default GameCanvas;
