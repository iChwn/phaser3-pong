let isGameStarted = false;
let ball;
let player1;
let player2;
let cursors;
let keys = {};
const paddleSpeed = 1000
let player1Score;
let player2Score;
let gameSceneProp;

const {difficulty, paddleConfig} = gameSetting

const GameScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    gameSceneProp = this
    Phaser.Scene.call(this, { key: 'GameScene' });
    console.log(this)
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
    pauseScreen("GameScene", gameSceneProp)
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

    player1Score = this.add.text(this.physics.world.bounds.width - 130, 20, `Score P1: ${gameScore.player1}`);  
    player2Score = this.add.text(20, 20, `Score P2: ${gameScore.player2}`);
  
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
      gameScore.player2 = gameScore.player2 + 1
      setWinnerText(this, "Player 2 Win")
    }
    if(ball.body.x < player2.body.x) {
      gameScore.player1 = gameScore.player1 + 1     
      setWinnerText(this, "Player 1 Win")
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

function renderScore() {
  player1Score.setText('Score P1: ' + gameScore.player1);
  player2Score.setText('Score P2: ' + gameScore.player2);
}

function handleBallSpeed(ball, player) {
  const pSpeed = player === "p1" ? -paddleSpeed : paddleSpeed
  const counterSpeed = player === "p1" ? -70 : 70
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
function setParticle(self, element, color) {
  if(emitter) {
    emitter.stop()
    // particles.destroy()
  }

  particles = self.add.particles(color);
  emitter = particles.createEmitter({
    speed: 50,
    scale: { start: 1, end: 0 },
    blendMode: "ADD"
  });
  emitter.startFollow(element);
  // emitter.setAlpha(function (p, k, t) {
  //   return 1 - 2 * Math.abs(t - 0.5);
  // });

  self.time.delayedCall(1000, function() {
    emitter.stop()
  });
}

function setWinnerText(self, victoryText) {
  let data = self
  isGameStarted = false
  ball.body.setVelocityX(0)
  ball.body.setVelocityY(0)
  renderScore() 
  
  let playerVictoryTex = data.add.text(
    data.physics.world.bounds.width / 2,
    data.physics.world.bounds.height / 2,
    victoryText
  )
  playerVictoryTex.setOrigin(.5);
  
  pauseScreen("pause")
  gameSceneProp.scene.launch('RetryScene');


  // let retry = data.add.text(
  //   data.physics.world.bounds.width / 2,
  //   data.physics.world.bounds.height / 1.6,
  //   "Retry?"
  // )
  // retry.setOrigin(.5);

  // let mainMenu = data.add.text(
  //   data.physics.world.bounds.width / 2,
  //   data.physics.world.bounds.height / 1.4,
  //   "Main Menu"
  // )
  // mainMenu.setInteractive().on('pointerdown', function() {
  //   console.log(data)
  //   data.scene.scene.start('MenuScene');
  // });
  // mainMenu.setOrigin(.5);

}