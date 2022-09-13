console.log(Phaser)

const config = {
  type: Phaser.AUTO,
  parent: "game",
  width: 800,
  height: 640,
  scale: {
    // mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [
    MenuScene,
    GameScene,
    RetryScene,
  ],
  physics: {
    default: "arcade",
    arcade: {
        gravity: false
    }
  },
}

const game = new Phaser.Game(config)

function pauseScreen(sceneName, gameSceneProp) {
  if(sceneName === "resume" || sceneName === "pause") {
    if(sceneName === "pause") {
      window.dispatchEvent(new KeyboardEvent("keypress",{"key": "p"}));
    } else {
      window.dispatchEvent(new KeyboardEvent("keypress",{"key": "r"}));
    }
  } else {
    window.onkeypress = (event) => {
      if(event.key === "p") {
        gameSceneProp.scene.pause(sceneName)
      }
      if(event.key === "r") {
        gameSceneProp.scene.resume(sceneName)
      }
    };
  }
}