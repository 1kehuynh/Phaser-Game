
import Phaser from "phaser";
export default class main extends Phaser.Scene {
    constructor ()
    {
        super('main');
    }

    preload ()
    {   

        this.load.image('whip', 'whip.png');
        this.load.image('chatgpt', 'chatgpt.png');
        this.load.image('chatgpt2', 'chatgpt2.png');
        this.load.image('bat', 'bat.png')
        this.load.image('ow', 'ow.png')
    }

    create ()
    {   
        
        this.weapon = 'none';
       
        
        
        this.anims.create(
            {
                key: 'twerk',
                frames: [
                    {key: 'chatgpt'},
                    {key: 'chatgpt2'},
                ],
                frameRate: 1,
                repeat: -1,
            }
        )
        const bot = this.add.sprite(740, 500, 'chatgpt').play('twerk').setInteractive().on('pointerdown', () => {
            if(this.weapon != 'none'){
                bot.setTexture('ow')
                bot.setTint('0xff0000')
                this.time.delayedCall(250, () => {
                    bot.clearTint(); 
                });
            }
        });
        
        const whipButton = new button(this, 30, 30, 'whip', (btn) => {
            if(this.weapon === 'whip'){
                this.whip.setActive(false)
                this.whip.setVisible(false)
                this.weapon = 'none';
                btn.icon.setVisible(true);
            } else {
                this.whip.setActive(true)
                this.whip.setVisible(true)
                this.weapon = 'whip';
                btn.icon.setVisible(false);
            }
        })

        const batButton = new button(this, 90, 30, 'bat', (btn) => {
            if(this.weapon === 'bat'){
                this.bat.setActive(false)
                this.bat.setVisible(false)
                this.weapon = 'none';
                btn.icon.setVisible(true);
            } else {
                this.bat.setActive(true)
                this.bat.setVisible(true)
                this.weapon = 'bat';
                btn.icon.setVisible(false);
            }
            
        })


        this.whip = this.add.sprite(200, 200, 'whip')
        this.whip.setActive(false)
        this.whip.setVisible(false)
        
        this.bat = this.add.sprite(200, 200, 'bat').setInteractive();
        this.bat.setActive(false)
        this.bat.setVisible(false)
        this.bat.on('pointerdown', () => {
            this.tweens.add({
                targets: this.bat,
                rotation: 50,
                duration: 100,
            })
        })

    }

    update () 
    {   
        if(this.weapon === 'whip'){
            this.whip.setPosition(this.input.activePointer.x - 50,this.input.activePointer.y + 50);
        } 
        if(this.weapon === 'bat'){
            this.bat.setPosition(this.input.activePointer.x - 50,this.input.activePointer.y + 50);
        } 
        console.log(this.weapon)
    }
}

class button extends Phaser.GameObjects.Container {
    constructor(scene, x, y, iconKey, callback) {
        super(scene, x, y);

        this.bg = scene.add.rectangle(x, y, 75, 75).setInteractive();
        this.bg.setStrokeStyle(2, 0x1a65ac);
        this.icon = scene.add.image(x, y, iconKey).setScale(0.5, 0.5);

        this.add([this.bg, this.icon]);

        scene.add.existing(this);

        this.bg.on('pointerover', () => {
            scene.tweens.add({ targets: this, scale: 1.1, duration: 100 });
        });

        this.bg.on('pointerout', () => {
            scene.tweens.add({ targets: this, scale: 1.0, duration: 100 });
        });

        this.bg.on('pointerdown', () => {
            callback(this);
        });
    }
}
