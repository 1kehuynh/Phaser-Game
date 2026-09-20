
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
        this.load.image('tung', 'tung.png')
        this.load.audio('whipcrack','whipcrack.wav')
    }

    create ()
    {   
        this.weapon = 'none';
        

        this.whip = new weapon(this, 'whip')
        this.bat = new weapon(this, 'bat')

        this.twerk = this.anims.create(
            {
                key: 'twerk',
                frames: [
                    {key: 'chatgpt'},
                    {key: 'chatgpt2'},
                ],
                frameRate: 2,
                repeat: -1,
            }
        )
        this.botHit = 'none'
        this.bot = new bot(this, 640, 500, 'chatgpt', this.twerk)

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
        } else if(this.weapon === this.bat){
            this.bat.setPosition(this.input.activePointer.x, this.input.activePointer.y);
        }

        this.bot.generate()
        
    }
}
class tung extends Phaser.GameObjects.Sprite{
    constructor(scene, botX, botY, key, anim){
        super(scene, (Math.random() * 20)+ (botX - 5), botY, key);
        scene.add.existing(this)


        this.startX = this.x;
        const endX = this.x - (Math.random() * 100) - 150;
        this.startY = this.y;
        const endY = (Math.random() * 100) + (botY - 50);
        const arcHeight = (Math.random() * 50) + 100; 

        this.setDepth(endY)
        this.scene = scene;
        scene.tweens.add({
            targets: { progress: 0 },
            progress: 1,
            duration: 1000, // 1 second
            ease: 'Linear',
            onUpdate: (tween) => {
                let p = tween.getValue();
                // Linear interpolation for X
                this.x = Phaser.Math.Linear(this.startX, endX, p);
                
                // Parabolic or Sine arc for Y (Math.sin gives a smooth arc from 0 to PI)
                let heightOffset = Math.sin(p * Math.PI) * arcHeight;
                this.y = Phaser.Math.Linear(this.startY, endY, p) - heightOffset;
            },
            onComplete: () => {
                this.startRandomTween()
            }
        });



    }

    startRandomTween() {
        const randomX = Phaser.Math.Between(this.startX - 500, this.startX);
        const randomY = Phaser.Math.Between(this.startY - 300, this.startY + 300);

        if(randomX > this.x){
            this.setFlipX(true)
        } else {
            this.setFlipX(false)
        }

        this.scene.tweens.add({
            targets: this,
            x: randomX,
            y: randomY,
            duration: Phaser.Math.Between(1000, 4000), // Random speed
            ease: 'Linear',
            onUpdate: () => {
                this.setDepth(this.y)
            },
            onComplete: () => {
                
                if(Math.random() > 0.5) {
                    this.scene.time.delayedCall(Math.random() * 5000, () => {
                        this.startRandomTween()
                    })
                }else{
                    this.startRandomTween();
                }
            }
        });
    }
}


class bot extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, key, anim){
        super(scene, x, y, key);
        
        scene.add.existing(this)
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.play(anim.key).setInteractive().on('pointerdown', () => {
            if(this.weapon != 'none'){
                scene.botHit = this;
                console.log(scene.botHit)         
            }
        }).setOrigin(0.5);

        this.tungMeter = scene.add.rectangle(x, y + 70, 150, 10).setOrigin(0.5).setFillStyle('0xD3D3D3')
        this.timeTilTung = scene.add.rectangle(x - 75, y + 70, 5, 10).setOrigin( 0, 0.5).setFillStyle('0xB0E0E6')
    }

    generate(){
        this.timeTilTung.width += 0.2;
        if (this.timeTilTung.width >= this.tungMeter.width) {
            this.timeTilTung.width = 0;
            this.tung = new tung(this.scene, this.x - (this.width / 2) - 30, this.y, 'tung');
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

        this.on('animationupdate', (animation, frame) => {
            if (frame.index === 7) {              
                this.scene.sound.play('whipcrack');

                if(this.scene.botHit != 'none'){
                    const scene = this.scene;
                    const bot = scene.botHit;
                    bot.anims.stop()
                    bot.setTexture('ow')
                    bot.setTint('0xff0000')
                    scene.tweens.add({ 
                        targets: bot, 
                        y: bot.y - 10,
                        yoyo: true,
                        duration: 50
                    })
                    

                    if(bot.timeTilTung.width < bot.tungMeter.width - 30){
                        bot.timeTilTung.width += 30
                    } else{
                    // bot.timeTilTung.width = (bot.timeTilTung.width + 30) % (bot.tungMeter.width);
                    bot.timeTilTung.width += (bot.tungMeter.width - bot.timeTilTung.width - 1);
                    }

                    bot.timeTilTung.setFillStyle('0xF1E5AC')
                    bot.anims.timeScale = 4.0;
                    scene.time.delayedCall(3000, () => {bot.anims.timeScale = 1.0;})

                    const text = scene.add.text(scene.input.activePointer.x + (20 * Math.random()), scene.input.activePointer.y - (20 * Math.random()), 'Work Faster!!!').setDepth(2).setColor('#000000')
                    scene.tweens.add({ 
                        targets: text, 
                        y: text.y - 50,
                        alpha: 0,    
                        duration: 700,   
                        ease: 'Linear',
                        onComplete: () => {text.destroy();},
                    }); 
                    scene.time.delayedCall(200, () => {
                        bot.clearTint(); 
                        scene.botHit = 'none';
                        bot.anims.play('twerk');
                        bot.timeTilTung.setFillStyle('0xB0E0E6')
                    });
                }
                
            } 
        })
    }

    anim() {
        if(this.key == 'whip'){
            if (!this.anims.isPlaying || this.anims.currentAnim.key !== 'do') {
                this.once('animationcomplete-do', () => {
                    this.setTexture('whip');
                });

                this.play('do', true);
            }

        } else {
            this.scene.tweens.add({
                targets: this,
                duration: 80,
                rotation: 1.5,
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
