//Acessa o elemento canvas do html
const canvas = document.querySelector('canvas');
// Contextualiza c como um campo 2d
const c = canvas.getContext('2d');

//Seta o tamanho e altura do canvas
canvas.width = 1024;
canvas.height = 576;

// Variavel de gravidade que empurra os objetos para baixo
const gravity = 1;


// Instancia o canvas no html
c.fillRect(0, 0, canvas.width, canvas.height);

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: '/assets/img/background.png'
})

const shop = new Sprite({
    position: {
        x: 620,
        y: 128
    },
    imageSrc: '/assets/img/shop.png',
    scale: 2.75,
    maxFrames: 6,
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    imageSrc: '/assets/img/samuraiMack/Idle.png',
    maxFrames: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: '/assets/img/samuraiMack/Idle.png',
            maxFrames: 8
        },
        run: {
            imageSrc: '/assets/img/samuraiMack/Run.png',
            maxFrames: 8
        },
        jump: {
            imageSrc: '/assets/img/samuraiMack/Jump.png',
            maxFrames: 2
        },
        fall: {
            imageSrc: '/assets/img/samuraiMack/Fall.png',
            maxFrames: 2
        },
        attack1: {
            imageSrc: '/assets/img/samuraiMack/Attack1.png',
            maxFrames: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 158,
        height: 50
    }
});

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    },
    color: 'blue',
    imageSrc: '/assets/img/kenji/Idle.png',
    maxFrames: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: '/assets/img/kenji/Idle.png',
            maxFrames: 4
        },
        run: {
            imageSrc: '/assets/img/kenji/Run.png',
            maxFrames: 8
        },
        jump: {
            imageSrc: '/assets/img/kenji/Jump.png',
            maxFrames: 2
        },
        fall: {
            imageSrc: '/assets/img/kenji/Fall.png',
            maxFrames: 2
        },
        attack1: {
            imageSrc: '/assets/img/kenji/Attack1.png',
            maxFrames: 4
        }
    },
    attackBox: {
        offset: {
            x: -172,
            y: 50
        },
        width: 172,
        height: 50
    }
});

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    //player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -10;
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 10;
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }
    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }

    //Enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -10
        enemy.switchSprite('run');
    }
    else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 10;
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    if (rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) && player.isAttacking && player.frameCurrent === 4
    ) {
        player.isAttacking = false;
        enemy.health -= 20;
        document.querySelector('#enemy-health').style.width = enemy.health + '%';
    }

    if (player.isAttacking && player.frameCurrent === 4) {
        player.isAttacking = false;
    }

    if (rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) && enemy.isAttacking && enemy.frameCurrent === 2
    ) {
        enemy.isAttacking = false;
        player.health -= 20;
        document.querySelector('#player-health').style.width = player.health + '%';
    }

    if(enemy.isAttacking && enemy.frameCurrent ===2) {
        enemy.isAttacking = false;
    }

    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })
    }
}

animate();

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        case 'w':
            player.velocity.y = -20;
            break;
        case ' ':
            player.attack();
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
        case 'ArrowUp':
            enemy.velocity.y = -20;
            break;
        case 'ArrowDown':
            enemy.attack();
            break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;

        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
    }
});
