let isGameStarted = false;
let ball;
let player1;
let player2;
let cursors;
let keys = {};
const paddleSpeed = 1000

const {difficulty, paddleConfig} = gameSetting

const GameScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { key: 'GameScene' });
  },
  init: function (data) {
    console.log("INIT GAME SCENE")
  },
  preload: function () {
    this.load.image("ball", "./src/assets/images/ball.png")
    this.load.image("paddle", "./src/assets/images/paddle.png")
    this.load.image('red', './src/assets/images/red.png');
    this.load.image('blue', './src/assets/images/blue.png');
  },
  create: function () {
    ball = this.physics.add.sprite(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2,
      "ball"
    )
    ball.setCollideWorldBounds(true);
    ball.setBounce(1,1);
  
    player1 = this.physics.add.sprite(
      this.physics.world.bounds.width - (ball.body.width / 2 + 1),
      this.physics.world.bounds.height / 2,
      "paddle"
    )
    player1.displayHeight = paddleConfig.paddleLength[gameSetting.difficulty]
    player1.setCollideWorldBounds(true);
    player1.setImmovable(true)
  
    player2 = this.physics.add.sprite(
      ball.body.width / 2 + 1,
      this.physics.world.bounds.height / 2,
      "paddle"
    )
    player2.displayHeight = paddleConfig.paddleLength[gameSetting.difficulty]
    player2.setCollideWorldBounds(true);
    player2.setImmovable(true)
  
    cursors = this.input.keyboard.createCursorKeys();
    keys.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keys.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  
  
    this.physics.add.collider(ball, player1, colliderP1Callback, null, this)
    this.physics.add.collider(ball, player2, colliderP2Callback, null, this)
  },
  update: function (time, delta) {
    if(!isGameStarted) {
      const initialVeloY = (Math.random() * 300) + 100;
      const initialVeloX = (Math.random() * 300) + 100;
      ball.setVelocityX(initialVeloX)
      ball.setVelocityY(initialVeloY)
      isGameStarted = true
    }
  
    if(ball.body.x > player1.body.x) {
      ball.body.setVelocityX(0)
      ball.body.setVelocityY(0)
      setWinnerText(this, "Player 2 Win")
      game.destroy()
    }
    if(ball.body.x < player2.body.x) {
      ball.body.setVelocityX(0)
      ball.body.setVelocityY(0)
      setWinnerText(this, "Player 1 Win")
      game.destroy()
    }
  
    player1.body.setVelocityY(0)  
    player2.body.setVelocityY(0)
  
    // player1.body.setVelocityY(ball.body.velocity.y)
    player2.body.setVelocityY(ball.body.velocity.y)
  
    if(cursors.up.isDown) {
      player1.body.setVelocityY(-paddleSpeed)
    }
    if(cursors.down.isDown) {
      player1.body.setVelocityY(paddleSpeed)
    }
    if(keys.w.isDown) {
      player2.body.setVelocityY(-paddleSpeed)
    }
    if(keys.s.isDown) {
      player2.body.setVelocityY(paddleSpeed)
    }
  
    // if(ball.body.velocity.y > paddleSpeed) {
    //   console.log("ball max speed")
    //   ball.body.setVelocityY(-paddleSpeed)
    // }
  },
});

function colliderP1Callback() {
  handleBallSpeed(ball, "p1")
  setParticle(this, ball, "red")
}

function colliderP2Callback() {
  handleBallSpeed(ball, "p2")
  setParticle(this, ball, "blue")
}

function handleBallSpeed(ball, player) {
  const pSpeed = player === "p1" ? -paddleSpeed : paddleSpeed
  const counterSpeed = player === "p1" ? -50 : 50
  const logic = player === "p1" ? ">" : "<"
  const isValid = eval(ball.body.velocity.x + logic + pSpeed);

  console.log(ball.body.velocity.x)
  if(isValid) {
    ball.setVelocityX(ball.body.velocity.x + counterSpeed)
    ball.setVelocityY(ball.body.velocity.y + counterSpeed)
  }
}

let emitter;
let particles;
function setParticle(param, element, color) {
  if(emitter) {
    emitter.stop()
    // particles.destroy()
  }

  particles = param.add.particles(color);
  emitter = particles.createEmitter({
    speed: 50,
    scale: { start: 1, end: 0 },
    blendMode: "ADD"
  });
  emitter.startFollow(element);
  // emitter.setAlpha(function (p, k, t) {
  //   return 1 - 2 * Math.abs(t - 0.5);
  // });

  param.time.delayedCall(1000, function() {
    emitter.stop()
  });
}

function setWinnerText(param, victoryText) {
  let data = param
  playerVictoryTex = data.add.text(
    data.physics.world.bounds.width / 2,
    data.physics.world.bounds.height / 2,
    victoryText
  )
  playerVictoryTex.setOrigin(.5);
}