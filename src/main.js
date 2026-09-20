import Phaser from "phaser";
import { Game } from "phaser";
const canvas = document.getElementById("game");

import menu from './menu.js';
import main from './game.js';
var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scale:{
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [main],
    parent: 'game', 
    backgroundColor: 'rgba(255, 255, 255, 0)',
   
    
};


var game = new Phaser.Game(config);

