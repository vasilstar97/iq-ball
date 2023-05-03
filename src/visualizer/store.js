import { makeAutoObservable } from "mobx";

const colors = {
  blue: "#0088be",
  red: "#fb6d85",
};

export const positions = {
  left: "left",
  right: "right",
};

class Store {
  bridge = null;
  leftQueue = null;
  rightQueue = null;

  get currentQueue() {
    if (this.bridge.position === positions.left) return this.leftQueue;
    else return this.rightQueue;
  }

  slideUp() {
    const topBall = this.bridge.getTopBall();
    const botBall = this.currentQueue.slideUp(topBall);
    this.bridge.pushBot(botBall);
  }

  slideDown() {
    const botBall = this.bridge.getBotBall();
    const topBall = this.currentQueue.slideDown(botBall);
    this.bridge.pushTop(topBall);
  }

  keyDown(code) {
    switch (code) {
      case "ArrowLeft":
        this.bridge.slideLeft();
        break;
      case "ArrowRight":
        this.bridge.slideRight();
        break;
      case "ArrowUp":
        this.slideUp();
        break;
      case "ArrowDown":
        this.slideDown();
        break;
    }
  }

  initialize() {
    for (let i = 0; i < 16; i++) {
      const blueBall = new Ball(colors.blue);
      const redBall = new Ball(colors.red);
      if (i < 14) {
        this.leftQueue.push(blueBall);
        this.rightQueue.push(redBall);
      } else {
        this.bridge.pushTop(blueBall);
        this.bridge.pushBot(redBall);
      }
    }
  }

  constructor() {
    makeAutoObservable(this);
    this.bridge = new Bridge(this);
    this.leftQueue = new Queue(this);
    this.rightQueue = new Queue(this);
    this.initialize();
  }
}

class Bridge {
  store = null;
  balls = [];
  position = positions.left;

  pushTop(ball) {
    this.balls = [ball, ...this.balls];
  }

  pushBot(ball) {
    this.balls = [...this.balls, ball];
  }

  slideLeft() {
    this.position = positions.left;
  }

  slideRight() {
    this.position = positions.right;
  }

  getTopBall() {
    const topBall = this.balls[0];
    this.balls = this.balls.filter((ball) => ball !== topBall);
    return topBall;
  }

  getBotBall() {
    const botBall = this.balls[this.balls.length - 1];
    this.balls = this.balls.filter((ball) => ball !== botBall);
    return botBall;
  }

  constructor(store) {
    makeAutoObservable(this);
    this.store = store;
  }
}

class Queue {
  store = null;
  balls = []; // up -> down

  push(ball) {
    this.balls.push(ball);
  }

  get topBalls() {
    return this.balls.slice(0, 7).reverse();
  }

  get botBalls() {
    return this.balls.slice(7).reverse();
  }

  slideUp(inputBall) {
    let outputBall = this.balls[this.balls.length - 1]; //get down ball
    this.balls = [inputBall, ...this.balls.filter((ball) => ball !== outputBall)];
    return outputBall; //return it back
  }

  slideDown(inputBall) {
    let outputBall = this.balls[0]; //get up ball
    this.balls = [...this.balls.filter((ball) => ball !== outputBall), inputBall];
    return outputBall; //return it back
  }

  constructor(store) {
    makeAutoObservable(this);
    this.store = store;
  }
}

class Ball {
  color = null;

  constructor(color) {
    makeAutoObservable(this);
    this.color = color;
  }
}

export default new Store();
