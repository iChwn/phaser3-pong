var MenuScene = new Phaser.Class({

  //The scene is noted.
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { key: 'MenuScene' });
  },
  preload: function () {
      //preload media for MenuScene here
  },
  create: function () {
      var gs = this.add.text(500,500, 'masih develop');
      var txt1 = this.add.text(400,100, 'Select Difficulty');
      txt1.setOrigin(.5);

      var dif1 = this.add.text(400,300, 'Cupu');
      dif1.setInteractive().on('pointerdown', function() {
        gameSetting.difficulty = "cupu"
        this.scene.scene.start('GameScene');
        // console.log("CUPU ASU")
      });
      dif1.setOrigin(.5);

      var dif2 = this.add.text(400,350, 'Ultra Pro X Max Nmax');
      dif2.setInteractive().on('pointerdown', function() {
        gameSetting.difficulty = "promax"
        this.scene.scene.start('GameScene');
        // console.log("PRO")
      });
      dif2.setOrigin(.5);

  },
  update:function(){  

  }
});