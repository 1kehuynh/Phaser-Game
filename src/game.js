
import Phaser from "phaser";
export default class main extends Phaser.Scene {
    constructor ()
    {
        super('main');
    }

    preload ()
    {   

        this.load.image('whip', 'whip.png');
        this.load.image('mute', 'mute.png');
        this.load.image('muted', 'muted.png')
        this.load.image('chatgpt', 'chatgpt.png');
        this.load.image('chatgpt2', 'chatgpt2.png');
        this.load.image('bat', 'bat.png')
        this.load.image('ow', 'ow.png')
        this.load.spritesheet('whipanim', 'whipsheet2.png', {
            frameWidth: 600,
            frameHeight: 600
        });
        this.load.spritesheet('tungWalk', 'tungWalk.png', {
            frameWidth: 90,
            frameHeight: 90
        })
        this.load.image('tung', 'tung.png')

        //whipcrack credits: whip and crack sound by JayRom01 -- https://freesound.org/s/615761/ -- License: Creative Commons 0
        this.load.audio('whipcrack','whipcrack.wav')
        this.load.audio('tungsounds','tungsahursounds.mp3')
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

        this.input.on('pointerdown', () => {
            if(this.weapon === this.bat){
                this.bat.anim();
            } else if(this.weapon === this.whip){
               this.whip.anim();
            }
        })

        this.cursors = this.input.keyboard.createCursorKeys()
        this.wasd = this.input.keyboard.addKeys({
            up: "W",
            down: "S",
            left: "A",
            right: "D",
        });

        this.scene.launch('UIScene')
        const uiScene = this.scene.get('UIScene')

        this.events.on('muteClicked', () => {
            this.sound.mute = !this.sound.mute
        })
        
        this.events.on('btnClicked', (btn) => {
            this.whip.setVisible(false)
            this.whip.setActive(false)
            this.bat.setVisible(false)
            this.bat.setActive(false)
            console.log(btn.weaponType)
            if(btn.weaponType === 'whip' && this.weapon != this.whip){
                this.weapon = this.whip;
                this.weapon.setVisible(true)
                this.weapon.setActive(true)
                btn.setSelected();
            }
            else if(btn.weaponType === 'bat' && this.weapon != this.bat){
                this.weapon = this.bat;
                this.weapon.setVisible(true)
                this.weapon.setActive(true)
                btn.setSelected();
            } else {
                btn.setUnselected();
                this.weapon = 'none'
            }
        } 
        )
    }

    update () 
    {   
        if(this.weapon === this.whip && this.whip.anims.isPlaying == false){
            this.whip.setPosition(this.input.activePointer.x - 70,this.input.activePointer.y + 50);
        } else if(this.weapon === this.bat){
            this.bat.setPosition(this.input.activePointer.x, this.input.activePointer.y);
        }

        this.bot.generate()
        
        if (this.cursors.left.isDown || this.wasd.left.isDown)
        {
            this.cameras.main.scrollX = this.cameras.main.scrollX - 1;
        }
        if (this.cursors.right.isDown || this.wasd.right.isDown)
        {
            this.cameras.main.scrollX = this.cameras.main.scrollX + 1;
        }
        if(this.cursors.up.isDown || this.wasd.up.isDown){
            this.cameras.main.scrollY = this.cameras.main.scrollY - 1;
        }
        if(this.cursors.down.isDown || this.wasd.down.isDown){
            this.cameras.main.scrollY = this.cameras.main.scrollY + 1;
        }
    }
    

}
class tung extends Phaser.GameObjects.Sprite{
    constructor(scene, botX, botY, key, anim){
        super(scene, (Math.random() * 20)+ (botX - 5), botY, key);
        scene.add.existing(this)
        this.scene.sound.add('tungsounds', {volume: 0.5}).play()

        if (!scene.anims.exists('walk')) {
            this.scene.anims.create({
                key: 'walk',
                frames: this.scene.anims.generateFrameNumbers('tungWalk', {
                    start: 0,
                    end: 2
                }),
                frameRate: 15,
                repeat: -1 
            });
        }


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
        this.play('walk', true);
        const randomX = Phaser.Math.Between(this.startX - 500, this.startX);
        const randomY = Phaser.Math.Between(this.startY - 300, this.startY + 300);
        const totalDist = Phaser.Math.Distance.Between(this.x, this.y, randomX, randomY)
        let duration = Phaser.Math.Between(1000, 6000)
        let e = (totalDist * 10)/duration;

        this.anims.timeScale = e;
        if(randomX > this.x){
            this.setFlipX(true)
        } else {
            this.setFlipX(false)
        }

        if(Math.random() > 0.5) {
            this.scene.tweens.add({
            targets: this,
            x: randomX,
            y: randomY,
            duration: duration, // Random speed
            ease: 'Linear',
            onUpdate: () => {
                this.setDepth(this.y)
            },
            onComplete: () => {
                this.startRandomTween();             
            }
        });
        } else {
            this.stop()
            this.setTexture('tung');
            this.scene.time.delayedCall(Math.random() * 9000, () => {
                this.startRandomTween()
            })
        }
        
        
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


        let genP = scene.add.text(x, y + 55, '').setColor('#000000').setOrigin(0.5)
        let gen = '...'
        let wordCount = 0;
        scene.time.addEvent({
            delay: 1000,
            callback: () => {
                genP.text = 'Generating' + gen.substring(0, wordCount % 4 + 1);
                wordCount += 1;
            },
            repeat: -1
        })

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
        this.setScrollFactor(0);
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
        scene.add.existing(this);
        this.setScrollFactor(0);
    
        if(config.type === 'weapon'){
            this.bg = scene.add.rectangle(x, y, 75, 75).setInteractive({ useHandCursor: true });
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
            this.icon = scene.add.image(x, y, config.weaponType.texture).setScale(0.5, 0.5);
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
            this.add([this.bg]);
        } else if (config.type === 'mute'){
            this.icon = scene.add.image(x, y, config.type).setScale(0.75, 0.75).setInteractive({ useHandCursor: true });
            this.icon.input.camera = scene.cameras.main; 
            console.log(scene.sound.mute)
            this.icon.on('pointerdown', () => {
                if(scene.sound.mute){
                    scene.sound.setMute(false)
                    this.icon.setTexture('mute');
                } else {
                    scene.sound.setMute(true)
                    this.icon.setTexture('muted');
                }
            })   
            
            this.icon.on('pointerover', () => {
                this.icon.setTint(0xFF0000).setTintMode(Phaser.TintModes.FILL)
            });
            this.icon.on('pointerout', () => {
                this.icon.clearTint();
            })
        }
        this.add([this.icon]);
    }
}
