import MainScene from './MainScene.js';
//Cau hinh game 
const config = {
    width: 640,
    height: 640,
    type: Phaser.AUTO,
    parent: 'phaser',
    scene: [MainScene]
};

new Phaser.Game(config);