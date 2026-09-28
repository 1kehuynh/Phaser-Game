import Phaser from "phaser";
import {bot} from './entities.js'
export default class main extends Phaser.Scene {
    constructor ()
    {
        super('main');
    }

    preload ()
    {   
        

        this.load.image('chatgpt', 'chatgpt.png');
        this.load.image('chatgpt2', 'chatgpt2.png');
        this.load.image('ow', 'ow.png')
        this.load.image('temp', 'temp.png')
        this.load.image('heart', 'heart.png')
        this.load.image('screen', 'screen.png')

        this.load.image('bat', 'bat.png')
        this.load.image('whip', 'whip.png');
        this.load.spritesheet('whipanim', 'whipsheet2.png', {
            frameWidth: 600,
            frameHeight: 600
        });
        //whipcrack credits: whip and crack sound by JayRom01 -- https://freesound.org/s/615761/ -- License: Creative Commons 0
        this.load.audio('whipcrack','whipcrack.wav')
        this.load.image('mute', 'mute.png');

        this.load.image('muted', 'muted.png')
        this.load.audio('tungsounds','tungsahursounds.mp3')
        this.load.spritesheet('tungWalk', 'tungWalk.png', {
            frameWidth: 90,
            frameHeight: 90
        })
        this.load.image('tung', 'tung.png')

        
        this.load.image('lake', 'lake.png')

    }

    create ()
    {   
        this.weapon = 'none';
        this.tungs = [];

        this.whip = new weapon(this, 'whip')
        this.bat = new weapon(this, 'bat')

        this.lake = this.add.image(640, 1500, 'lake')

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

        this.cameraSpeed = 4;
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
            this.cameras.main.scrollX = this.cameras.main.scrollX - this.cameraSpeed;
        }
        if (this.cursors.right.isDown || this.wasd.right.isDown)
        {
            this.cameras.main.scrollX = this.cameras.main.scrollX + this.cameraSpeed;
        }
        if(this.cursors.up.isDown || this.wasd.up.isDown){
            this.cameras.main.scrollY = this.cameras.main.scrollY - this.cameraSpeed;
        }
        if(this.cursors.down.isDown || this.wasd.down.isDown){
            this.cameras.main.scrollY = this.cameras.main.scrollY + this.cameraSpeed;
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
                    this.scene.botHit.whipped();
                    const text = scene.add.text(scene.input.activePointer.x + (20 * Math.random()), scene.input.activePointer.y - (20 * Math.random()), 'Work Faster!!!').setDepth(2).setColor('#000000')
                    scene.tweens.add({ 
                        targets: text, 
                        y: text.y - 50,
                        alpha: 0,    
                        duration: 700,   
                        ease: 'Linear',
                        onComplete: () => {text.destroy();},
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


