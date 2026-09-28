import Phaser from "phaser";
export class bot extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, key, anim){
        super(scene, x, y, key);
        this.scene = scene;
        this.x = x;
        this.y = y;

        const alignX = this.x + 250;
        const alignY = this.y - 150;
        this.screen = scene.add.image(alignX - 40, alignY + 50, 'screen').setOrigin(0.5)

        scene.add.existing(this)
        

        this.status = 'Generating'
        this.temperature = 0;
        this.health = 180;
        this.play(anim.key).setInteractive({ useHandCursor: true }).on('pointerdown', () => {
            if(this.weapon != 'none'){
                scene.botHit = this;
                //console.log(scene.botHit)         
            }
        }).setOrigin(0.5);


        scene.add.text(alignX, alignY - 10, 'Status: ').setColor('#ffffff').setOrigin(0.5)
        this.genP = scene.add.text(alignX, alignY + 5, '').setColor('#11b625').setOrigin(0.5)
        let gen = '...'
        let wordCount = 0;
        scene.time.addEvent({
            delay: 1000,
            callback: () => {
                this.genP.text = this.status + gen.substring(0, wordCount % 4 + 1);
                wordCount += 1;
            },
            repeat: -1
        })

        /*
        this.tungMeter = scene.add.rectangle(alignX, alignY + 20, 150, 10).setOrigin(0.5).setFillStyle('0xD3D3D3')
        this.timeTilTung = scene.add.rectangle(alignX - 75, alignY + 20, 5, 10).setOrigin( 0, 0.5).setFillStyle('0xB0E0E6')

        this.healthMeter = scene.add.rectangle(alignX, alignY + 20, 150, 10).setOrigin(0.5).setFillStyle('0xD3D3D3').setVisible(false)
        this.currentHealth = scene.add.rectangle(alignX - 75, alignY + 20, this.health, 10).setOrigin(0, 0.5).setFillStyle('0xff0000').setVisible(false)
        this.heartImage = scene.add.image(alignX - 80, alignY + 20, 'heart').setVisible(false).setScale(0.9)

        const tempAlign = 60;
        this.tempMeter = scene.add.rectangle(alignX, alignY + tempAlign, 150, 10).setOrigin(0.5).setFillStyle('0xD3D3D3')
        this.currentTemp = scene.add.rectangle(alignX - 75, alignY + tempAlign, this.temperature, 10).setOrigin(0, 0.5).setFillStyle('0xB0E0E6')
        this.tempImage = scene.add.image(alignX - 80, alignY + tempAlign, 'temp')
        */
        this.tungMeter = new statusBar(scene, alignX, alignY + 40, '0xB0E0E6', 'heart', 'Time:');
        //this.tungMeter.icon.setScale(0.8)
        this.healthMeter = new statusBar(scene, alignX, alignY + 40, '0xff0000', 'heart', 'Health:')
        this.healthMeter.setVisible(false);
        this.healthMeter.setActive(false)
        this.tempMeter = new statusBar(scene, alignX, alignY + 70, '0xB0E0E6', 'temp', 'Temperature:')
    }

    generate(){  
        
        if (this.temperature >= this.tempMeter.outer.width) {
            this.status = 'Overheating'
            this.genP.setColor('#ff0000')
            this.healthMeter.setVisible(true).setActive(true)
            this.tungMeter.setVisible(false).setActive(false)
            this.health -= 0.05;
            this.healthMeter.update(this.health)
        } else {
            this.temperature += 0.1;
            this.tempMeter.update(this.temperature)
            if (this.tungMeter.currentStatus.width >= this.tungMeter.outer.width) {
                this.tungMeter.currentStatus.width = 0; 
                this.tung = new tung(this.scene, this.x - (this.width / 2) - 30, this.y, 'tung');
            } else {
                this.tungMeter.currentStatus.width += 0.2;
            }
        }     
    }

    whipped(){
        const scene = this.scene;
        const bot = scene.botHit;
        this.anims.stop()
        this.setTexture('ow')
        this.setTint('0xff0000')
        scene.tweens.add({ 
            targets: this, 
            y: this.y - 10,
            yoyo: true,
            duration: 50
        })
        
        if(this.tungMeter.currentStatus.width < this.tungMeter.outer.width - 30){
            this.tungMeter.currentStatus.width += 30
        } else{
            this.tungMeter.currentStatus.width += (this.tungMeter.outer.width - this.tungMeter.currentStatus.width - 1);
        }

        this.tungMeter.currentStatus.setFillStyle('0xF1E5AC')
        this.anims.timeScale = 4.0;
        scene.time.delayedCall(3000, () => {this.anims.timeScale = 1.0;})

        scene.time.delayedCall(200, () => {
            this.clearTint(); 
            scene.botHit = 'none';
            this.anims.play('twerk');
            this.tungMeter.currentStatus.setFillStyle('0xB0E0E6')
        });
    }
}

class statusBar extends Phaser.GameObjects.Container{
    constructor(scene, x, y, statusColor, key, type){
        super(scene, x, y)
        scene.add.existing(this)
        const alignX = -90

        //change bot health after chainging width
        this.width = 180
        this.outer = scene.add.rectangle(alignX, 0, this.width, 8).setOrigin(0, 0.5).setFillStyle('0xD3D3D3')
        this.currentStatus = scene.add.rectangle(alignX, 0, 0, 8).setOrigin(0, 0.5).setFillStyle(statusColor)
        this.icon = scene.add.image(alignX - 80, 0, key).setScale(0.75).setVisible(false)
        this.label = scene.add.text(alignX, -13, type).setColor('#ffffff').setOrigin(0, 0.5).setScale(0.7)
        this.add([this.outer, this.currentStatus, this.icon, this.label])
    }
    
    update(value){
        this.currentStatus.width = value;
    }
}

class tung extends Phaser.GameObjects.Sprite{
    constructor(scene, botX, botY, key, anim){
        super(scene, (Math.random() * 20)+ (botX - 5), botY, key);
        scene.add.existing(this)
        /*
        this.scene.sound.add('tungsounds',  {volume: 0.5, loop: true, source: {
        x: this.emitter.x,      // The initial X position of the sound source
        y: this.emitter.y,      // The initial Y position of the sound source
        panningModel: 'HRTF',   // High-fidelity spatial audio positioning
        distanceModel: 'linear',// Distance falloff algorithm ('linear', 'inverse', or 'exponential')
        refDistance: 1,         // Distance where volume starts dropping
        maxDistance: 500,       // Distance where sound becomes completely silent
        rolloffFactor: 1        // How fast the sound drops off
    }
}).play()*/
        this.scene.tungs.push(this)
        this.id = scene.tungs.length;
        console.log(scene.tungs.length)
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