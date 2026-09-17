
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
        this.load.spritesheet('whipanim', 'whipsheet2.png', {
            frameWidth: 600,
            frameHeight: 600
        });
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

        this.whip = new weapon(this, 'whip')
        this.bat = new weapon(this, 'bat')

        const bot = this.add.sprite(640, 500, 'chatgpt').play('twerk').setInteractive().on('pointerdown', () => {
            if(this.weapon != 'none'){
                this.whip.once('animationupdate', (animation, frame) => {
                    if (frame.index === 7) {
                        bot.setTexture('ow')
                        bot.setTint('0xff0000')
                        
                        const text = this.add.text(this.input.activePointer.x + (20 * Math.random()), this.input.activePointer.y - (20 * Math.random()), 'Work Faster!!!').setDepth(2).setColor('#000000')
                        this.tweens.add({ 
                            targets: text, 
                            y: text.y - 50,
                            alpha: 0,    
                            duration: 500,   
                            ease: 'Linear',
                            onComplete: () => {text.destroy();},
                        }); 
                        this.time.delayedCall(100, () => {
                            bot.clearTint(); 
                        });
                    }
                    
                }) 
                        
            }
        }).setOrigin(0.5);


        

        this.whipButton = new button(this, 30, 30, {type: 'weapon', weaponType: this.whip, siblings: []})
        this.batButton = new button(this, 100, 30, {type: 'weapon', weaponType: this.bat, siblings: []})
        this.whipButton.siblings = [this.batButton];
        this.batButton.siblings = [this.whipButton];


        this.input.on('pointerdown', () => {
            if(this.weapon === this.bat){
                this.bat.anim();
            } else if(this.weapon === this.whip){
               this.whip.anim();
            }
        })
    }

    update () 
    {   
        if(this.weapon === this.whip && this.whip.anims.isPlaying == false){
            this.whip.setPosition(this.input.activePointer.x - 70,this.input.activePointer.y + 50);
        } 
        if(this.weapon === this.bat){
            this.bat.setPosition(this.input.activePointer.x, this.input.activePointer.y);
        }

        
    }
}

class weapon extends Phaser.GameObjects.Sprite{
    constructor(scene, key){
        super(scene, 0, 0, key);
        this.setActive(false);
        this.setVisible(false);
        this.setDepth(1);
        this.scene = scene;
        scene.add.existing(this);
        this.key = key;
        
        if (!this.scene.anims.exists('do')) {
            this.scene.anims.create({
                key: 'do',
                frames: this.scene.anims.generateFrameNumbers('whipanim', {
                    start: 0,
                    end: 7
                }),
                frameRate: 12,
                repeat: 0 
            });
        }
    }

    anim() {
        if(this.key == 'whip'){
            this.once('animationcomplete-do', () => {
                this.setTexture('whip');
            });

            this.play('do', true);
        } else {
            this.scene.tweens.add({
                targets: this,
                duration: 100,
                rotation: Math.PI,
                ease: 'linear',
                onComplete: () => {
                    this.setRotation(0)
                }
            })
        }
    }
}


class button extends Phaser.GameObjects.Container {
    constructor(scene, x, y, config = {type, weaponType, siblings}) {
        super(scene, x, y);
        if(config.type === 'weapon'){
            this.bg = scene.add.rectangle(x, y, 75, 75).setInteractive();
            this.bg.setStrokeStyle(2, 0x1a65ac);
            this.icon = scene.add.image(x, y, config.weaponType.texture).setScale(0.5, 0.5);

            this.add([this.bg, this.icon]);

            scene.add.existing(this);

            this.bg.on('pointerover', () => {
                scene.tweens.killTweensOf(this);
                scene.tweens.add({ targets: this, scale: 1.1, duration: 100 });
            });

            this.bg.on('pointerout', () => {
                scene.tweens.killTweensOf(this);
                scene.tweens.add({ targets: this, scale: 1.0, duration: 100 });
            });

            this.bg.on('pointerdown', () => {
                //test cases, weapon is none and user clicks button, weapon is bat or whip and user clicks same, weapon is bat or whip and user clicks different
                //
                try{
                    scene.weapon.setVisible(false)
                    scene.weapon.setActive(false)
                    //if not clicking on same button as current weapon
                    if(scene.weapon != config.weaponType){
                        scene.weapon = config.weaponType;
                        scene.weapon.setVisible(true)
                        scene.weapon.setActive(true)
                        this.bg.setFillStyle('0x808080');
                        this.icon.setTint('0x808080')
                        this.siblings[0].bg.setFillStyle();
                        this.siblings[0].icon.clearTint();
                    } else{ //if clicking on same button as current weapon
                        scene.weapon = 'none'
                        this.bg.setFillStyle();
                        this.icon.clearTint();
                    }
                } catch {
                    scene.weapon = config.weaponType;
                    scene.weapon.setVisible(true)
                    scene.weapon.setActive(true)
                    this.bg.setFillStyle('0x808080');
                    this.icon.setTint('0x808080')
                }
            });
        }
    }
}
