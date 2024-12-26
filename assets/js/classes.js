class Sprite {
    constructor({ position, imageSrc, scale = 1, maxFrames = 1, offset = { x: 0, y: 0 } }) {
        this.position = position;
        this.height = 150;
        this.width = 50;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.maxFrames = maxFrames;
        this.frameCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.offset = offset
    }
    draw() {
        c.drawImage(
            this.image,
            this.frameCurrent * (this.image.width / this.maxFrames),
            0,
            this.image.width / this.maxFrames,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.maxFrames) * this.scale,
            this.image.height * this.scale)
    }

    update() {
        this.draw();
        this.framesElapsed++;
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.frameCurrent < this.maxFrames - 1) {
                this.frameCurrent++;
            } else {
                this.frameCurrent = 0;
            }
        }
    }
};
class Fighter extends Sprite {
    constructor({ position,
        velocity,
        color = 'red',
        imageSrc,
        scale = 1,
        maxFrames = 1,
        offset = { x: 0, y: 0 },
        sprites
    }) {
        super({
            position,
            imageSrc,
            scale,
            maxFrames,
            offset
        })
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.health = 100;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        };
        this.color = color;
        this.isAttacking;
        this.frameCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.sprites = sprites

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }
    animateFrame() {
        this.framesElapsed++;
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.frameCurrent < this.maxFrames - 1) {
                this.frameCurrent++;
            } else {
                this.frameCurrent = 0;
            }
        }
    }

    update() {
        this.draw();

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0;
            this.position.y = 330;
        } else this.velocity.y += gravity;

        this.animateFrame();
    }

    switchSprite(sprite) {
        if (this.image === this.sprites.attack1.image && this.frameCurrent < this.sprites.attack1.maxFrames - 1)
            return
        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.maxFrames = this.sprites.idle.maxFrames;
                    this.frameCurrent = 0;
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.maxFrames = this.sprites.run.maxFrames;
                    this.frameCurrent = 0;
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.maxFrames = this.sprites.jump.maxFrames;
                    this.frameCurrent = 0;
                }
                break;
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.maxFrames = this.sprites.fall.maxFrames;
                    this.frameCurrent = 0;
                }
                break;
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image;
                    this.maxFrames = this.sprites.attack1.maxFrames;
                    this.frameCurrent = 0;
                }
                break;
        }
    }

    attack() {
        this.switchSprite('attack1');
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100)
    }
};