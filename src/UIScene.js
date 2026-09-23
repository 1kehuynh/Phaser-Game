
import Phaser from "phaser";
export default class UIScene extends Phaser.Scene {
    constructor ()
    {
        super('UIScene');
    }

    preload ()
    {   
        this.load.image('whip', 'whip.png');
        this.load.image('mute', 'mute.png');
        this.load.image('muted', 'muted.png')
        this.load.image('bat', 'bat.png')
    } 
    
    create ()
    {   
        this.weapon = 'none'

        
        this.whipButton = new button(this, 30, 30, {type: 'weapon', weaponType: 'whip', siblings: []})
        this.batButton = new button(this, 100, 30, {type: 'weapon', weaponType: 'bat', siblings: []})
        this.whipButton.siblings = [this.batButton];
        this.batButton.siblings = [this.whipButton];
        

        this.gameScene = this.scene.get('main');
        this.muteButton = this.add.image(1000, 50, 'mute', ).setScale(0.75, 0.75).setInteractive({ useHandCursor: true });
        this.muteButton.on('pointerdown', () => {
            this.gameScene.events.emit('muteClicked')
            if(this.muteButton.texture.key == 'muted'){
                this.muteButton.setTexture('mute');
            } else {
                this.muteButton.setTexture('muted');
            }
        })
        this.muteButton.on('pointerover', () => {
            this.muteButton.setTint(0xFF0000).setTintMode(Phaser.TintModes.FILL)
        });
        this.muteButton.on('pointerout', () => {
            this.muteButton.clearTint();
        })
    }
}

class button extends Phaser.GameObjects.Container {
    constructor(scene, x, y, config = {type, weaponType, siblings}) {
        super(scene, x, y);
        scene.add.existing(this);

        this.type = config.type;
        this.weaponType = config.weaponType;
        this.siblings = config.siblings;

        if(config.type === 'weapon'){
            this.bg = scene.add.rectangle(x, y, 75, 75).setInteractive({ useHandCursor: true }).setFillStyle('0xFFFFFF')
            this.bg.input.camera = scene.cameras.main; 
            this.bg.setStrokeStyle(2, 0x1a65ac);

            this.bg.on('pointerover', () => {
                scene.tweens.killTweensOf(this);
                scene.tweens.add({ targets: this, scale: 1.1, duration: 100 });
            });

            this.bg.on('pointerout', () => {
                scene.tweens.killTweensOf(this);
                scene.tweens.add({ targets: this, scale: 1.0, duration: 100 });
            });
            this.icon = scene.add.image(x, y, config.weaponType).setScale(0.5, 0.5);
            
            this.bg.on('pointerdown', () => {
                scene.gameScene.events.emit('btnClicked', this)
                /*
                //test cases, weapon is none and user clicks button, weapon is bat or whip and user clicks same, weapon is bat or whip and user clicks different
                try{              
                    //if not clicking on same button as current weapon
                    if(this.weapon != config.weaponType){
                        this.weapon = config.weaponType
                        
                        this.bg.setFillStyle('0x808080');
                        this.icon.setTint('0x808080')
                        this.siblings[0].bg.setFillStyle();
                        this.siblings[0].icon.clearTint();
                    } else{ //if clicking on same button as current weapon
                        gameScene.weapon = 'none'
                        this.bg.setFillStyle();
                        this.icon.clearTint();
                    }
                } catch {
                    gameScene.weapon = config.weaponType;
                    gameScene.weapon.setVisible(true)
                    gameScene.weapon.setActive(true)
                    this.bg.setFillStyle('0x808080');
                    this.icon.setTint('0x808080')
                }*/
            });
            this.add([this.bg]);
        }     
        this.add([this.icon]);  
    }

    setSelected(){
        this.bg.setFillStyle('0x808080');
        this.icon.setTint('0x808080')
        this.siblings[0].bg.setFillStyle('0xFFFFFF');
        this.siblings[0].icon.clearTint();
    }

    setUnselected(){
        this.bg.setFillStyle('0xFFFFFF');
        this.icon.clearTint();
    }
}
