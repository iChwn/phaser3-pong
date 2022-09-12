console.log(Phaser)
const config = {
  type: Phaser.AUTO,
  parent: "game",
  width: 800,
  height: 640,
  // scale: {
  //   mode: Phaser.Scale.RESIZE,
  //   autoCenter: Phaser.Scale.CENTER_BOTH
  // },
  scene: {
    preload,
    create,
    update
  },
  physics: {
    default: "arcade",
    arcade: {
        gravity: false
    }
  },
}

const game = new Phaser.Game(config)
let ball;
let player1;
let player2;
let isGameStarted = false;
let cursors;
const paddleSpeed = 500
let keys = {};
let playerVictoryText;
let isNearP1 = false
let isNearP2 = false
let initParticle = false

function preload() {
  this.load.image("ball", "./src/assets/images/ball.png")
  this.load.image("paddle", "./src/assets/images/paddle.png")
  this.load.image('red', './src/assets/images/red.png');
  this.load.image('blue', './src/assets/images/blue.png');
}

function create() {
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
  player1.setCollideWorldBounds(true);
  player1.setImmovable(true)

  player2 = this.physics.add.sprite(
    ball.body.width / 2 + 1,
    this.physics.world.bounds.height / 2,
    "paddle"
  )
  player2.setCollideWorldBounds(true);
  player2.setImmovable(true)

  cursors = this.input.keyboard.createCursorKeys();
  keys.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  keys.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);


  this.physics.add.collider(ball, player1)
  this.physics.add.collider(ball, player2)
}

function update() {
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

  // player2.body.setVelocityY(-ball.body.y)

  if(ball.body.x > player1.body.x - 50 && !isNearP1) {
    isNearP1 = true
    isNearP2 = false
    setParticle(this, ball, "red")
  }
  if(ball.body.x < player2.body.x + 50 && !isNearP2) {
    isNearP2 = true
    isNearP1 = false
    setParticle(this, ball, "blue")
  }

  // if(ball.body.velocity.y > paddleSpeed) {
  //   console.log("ball max speed")
  //   ball.body.setVelocityY(-paddleSpeed)
  // }
}

let emitter;
let particles;
function setParticle(param, element, color) {
  if(emitter) {
    emitter.stop()
    // emitter.stopFollow();
    // particles.destroy()
  }

  particles = param.add.particles(color);
  emitter = particles.createEmitter({
    speed: 100,
    scale: { start: 1, end: 0 },
    blendMode: "ADD"
  });
  emitter.startFollow(element);
  // emitter.setAlpha(function (p, k, t) {
  //   return 1 - 2 * Math.abs(t - 0.5);
  // });

  param.time.delayedCall(1000, function() {
    emitter.stop()
    // emitter.destroy(element);
    // emitter.pause()
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