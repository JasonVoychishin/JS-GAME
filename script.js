//Переменные
let heroImg = document.querySelector('#hero-img');

let jumpBlock = document.querySelector('#jump-block');
jumpBlock.style.top = `${window.screen.height / 2 - 144 / 2}px`;


let hitBlock = document.querySelector('#hit-block');
hitBlock.style.top = `${window.screen.height / 2 - 144 / 2}px`;

let backgroundCanvas = document.querySelector('#background-canvas');
let hero = document.querySelector('#hero');
let rightPosition = 0;
let imgBlock = document.querySelector('#img-block');
imgBlock.style.bottom = '32px';
imgBlock.style.left = '0px';
let imgBlockPosition = 0;
let x = 0;
let halfWidth = window.screen.width / 2;
let tileArray = [];
let maxLives = 6;
let lives = 6;
let heartsArray = [];
let objectsArray = [];
let enemiesArray = [];
let canvas = document.querySelector('#canvas');
let fsBtn = document.querySelector('#fsbtn');
let timer = null;
let direction = 'right';
let hit = false;
let jump = false;
let fall = false;
let isRightSideBlocked = false;
let isLeftSideBlocked = false;
let wasHeroHit = false;

let heroX = Math.floor((Number.parseInt(imgBlock.style.left) + 32) / 32);
let heroY = Math.floor(Number.parseInt(imgBlock.style.bottom) / 32);

let info = document.querySelector('#info');
info.style.display = 'none';

let f1WallArray = [[-10, -1], [14, 33], [42, 53], [64, 75], [92, 106], [119, 129]];
let f2WallArray = [[54, 64]];
let isWallRight = false;
let isWallLeft = false;
let heroStep = 3;




//Функции


const moveWorldLeft = () => {
    objectsArray.map((elem, index) => {
        elem.style.left = Number.parseInt(elem.style.left) - 32 + 'px';
    });
    tileArray.map(elem => {
        elem[0] = elem[0] - 1
    });
    enemiesArray.map(elem => elem.moveLeft());
    f1WallArray.map(elem => {
        elem[0] -= 1;
        elem[1] -= 1;
    });
    f2WallArray.map(elem => {
        elem[0] -= 1;
        elem[1] -= 1;
    });
}

const moveWorldRight = () => {
    objectsArray.map((elem, index) => {
        elem.style.left = Number.parseInt(elem.style.left) + 32 + 'px';
    });
    tileArray.map(elem => {
        elem[0] = elem[0] + 1
    });
    enemiesArray.map(elem => elem.moveRight());
    f1WallArray.map(elem => {
        elem[0] += 1;
        elem[1] += 1;
    });
    f2WallArray.map(elem => {
        elem[0] += 1;
        elem[1] += 1;
    });
}

const updateHeroXY = () => {
    heroX = Math.ceil((Number.parseInt(imgBlock.style.left) + 32) / 32);
    heroY = Math.ceil(Number.parseInt(imgBlock.style.bottom) / 32);
    info.innerText = `heroX = ${heroX}, heroY = ${heroY}`;
}

const checkFalling = () => {
    updateHeroXY();
    let isFalling = true;
    for (let i = 0; i < tileArray.length; i++) {
        if ((tileArray[i][0] === heroX) && ((tileArray[i][1] + 1) === heroY)) {
            isFalling = false;
        }
    }
    if (isFalling) {
        info.innerText = info.innerText + ', falling';
        fall = true;
    } else {
        info.innerText = info.innerText + ', not falling';
        fall = false;
    }
}

const fallHandler = () => {
    heroImg.style.top = '-96px';
    imgBlock.style.bottom = `${Number.parseInt(imgBlock.style.bottom) - 32}px`;
    checkFalling();
}

const checkRightWallCollide = () => {
    isWallLeft = false;
    isWallRight = false;
    if (heroY === 1) {
        f1WallArray.map(elem => {
            if (heroX === elem[0] - 2) {
                isWallRight = true;
            }
        });
    } else if (heroY === 5) {
        f2WallArray.map(elem => {
            if (heroX === elem[0] - 2) {
                isWallRight = true;
            }
        });
    }
};

const checkLeftWallCollide = () => {
    isWallLeft = false;
    isWallRight = false;
    if (heroY === 1) {
        f1WallArray.map(elem => {
            if (heroX === elem[1]) {
                isWallLeft = true;
            }
        });
    } else if (heroY === 5) {
        f2WallArray.map(elem => {
            if (heroX === elem[1]) {
                isWallLeft = true;
            }
        });
    }
}

const rightHandler = () => {
    if (!isRightSideBlocked && !isWallRight) {
        heroImg.style.transform = 'scale(-1,1)';
        rightPosition = rightPosition + 1;
        imgBlockPosition = imgBlockPosition + 1;
        if (rightPosition > 5) {
            rightPosition = 0;
        }
        heroImg.style.left = `-${rightPosition * 96}px`;
        heroImg.style.top = '-192px';
        imgBlock.style.left = `${imgBlockPosition * heroStep}px`;

        checkFalling();
        wasHeroHit = false;
        moveWorldLeft();
        checkRightWallCollide();
    }

}

const leftHandler = () => {
    if (!isLeftSideBlocked && !isWallLeft) {
        heroImg.style.transform = 'scale(1,1)';
        rightPosition = rightPosition + 1;
        imgBlockPosition = imgBlockPosition - 1;
        if (rightPosition > 5) {
            rightPosition = 0;
        }
        heroImg.style.left = `-${rightPosition * 96}px`;
        heroImg.style.top = '-192px';
        imgBlock.style.left = `${imgBlockPosition * heroStep}px`;

        checkFalling();
        wasHeroHit = false;
        moveWorldRight();
        checkLeftWallCollide();
    }
}

const standHandler = () => {    
    switch (direction) {
        case 'right': {
            heroImg.style.transform = 'scale(-1,1)';
            if (rightPosition > 4) {
                rightPosition = 1;
            }
            break;
        }
        case 'left': {
            heroImg.style.transform = 'scale(1,1)';
            if (rightPosition > 3) {
                rightPosition = 0;
            }
            break;
        }
        default: break;
    }

    rightPosition = rightPosition + 1;
    heroImg.style.left = `-${rightPosition * 96}px`;
    heroImg.style.top = '0px';
    checkFalling();
}

let onTouchStart = (event) => {
    clearInterval(timer);
    if (event.type === 'mousedown') {
        x = event.screenX;
    } else if (event.type === 'keydown') {
        if (event.keyCode === 68) {
            x = halfWidth + 1;
        } else if (event.keyCode === 65) {
            x = halfWidth - 1;
        } else {
            removeEventListener('keydown');
        }
    }
    else {
        x = event.touches[0].screenX;
    };
    timer = setInterval(() => {
        if (x > halfWidth) {
            direction = 'right';
            rightHandler();
        }
        else if (x < halfWidth) {
            direction = 'left';
            leftHandler();
        }
    }, 130)
}

let onTouchEnd = (event) => {
    clearInterval(timer);
    lifeCycle();
}

const hitHandler = () => {
    switch (direction) {
        case 'right': {
            heroImg.style.transform = 'scale(-1,1)';
            if (rightPosition > 4) {
                rightPosition = 1;
                hit = false;
                wasHeroHit = true;
            }
            break;
        }
        case 'left': {
            heroImg.style.transform = 'scale(1,1)';
            if (rightPosition > 3) {
                rightPosition = 0;
                hit = false;
                wasHeroHit = true;
            }
            break;
        }
        default: break;
    }
    rightPosition = rightPosition + 1;
    heroImg.style.left = `-${rightPosition * 96}px`;
    heroImg.style.top = '-288px';
}

const jumpHandler = () => {
    isWallLeft = false;
    isWallRight = false;
    switch (direction) {
        case 'right': {
            heroImg.style.transform = 'scale(-1,1)';
            if (rightPosition > 4) {
                rightPosition = 1;
                jump = false;
                imgBlock.style.bottom = `${Number.parseInt(imgBlock.style.bottom) + 160}px`;
                imgBlockPosition = imgBlockPosition + 20;
                imgBlock.style.left = `${imgBlockPosition * heroStep}px`;
            }
            checkFalling()
            break;
        }
        case 'left': {
            heroImg.style.transform = 'scale(1,1)';
            if (rightPosition > 3) {
                rightPosition = 0;
                jump = false;
                imgBlock.style.bottom = `${Number.parseInt(imgBlock.style.bottom) + 160}px`;
                imgBlockPosition = imgBlockPosition - 20;
                imgBlock.style.left = `${imgBlockPosition * heroStep}px`;
            }
            checkFalling();
            break;
        }
        default: break;
    }
    rightPosition = rightPosition + 1;
    heroImg.style.left = `-${rightPosition * 96}px`;
    heroImg.style.top = '-96px';
}

const lifeCycle = () => {
    timer = setInterval(() => {
        if (hit) {
            hitHandler();
        } else if (jump) {
            jumpHandler();
        } else if (fall) {
            fallHandler();
        } else {
            standHandler();
        }

    }, 150);
}

//Обработчики событий

window.onmousedown = onTouchStart;
window.onmouseup = onTouchEnd;
window.addEventListener('touchstart', onTouchStart);
window.addEventListener('touchend', onTouchEnd);
window.addEventListener('keydown', onTouchStart);
window.addEventListener('keyup', onTouchEnd);

heroImg.onclick = (event) => {
    event.preventDefault();
}

fsBtn.onclick = (e) => {
    e.preventDefault();
    if (document.fullscreenElement) {
        fsBtn.src = './fullscreen.png';
        document.exitFullscreen();
    } else {
        canvas.requestFullscreen();
        fsBtn.src = './cancel.png';
    }
}


jumpBlock.onclick = () => {
    jump = true;
}
window.addEventListener('keydown', (e) => {
    if (e.keyCode === 32) {
        jump = true;
    }

})



hitBlock.onclick = () => {
    hit = true;
};
window.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        hit = true;
    }
})



const createTile = (x, y = 1) => {
    let tile = document.createElement('img');
    tile.src = './assets/1 Tiles/Tile_02.png';
    tile.style.position = 'absolute';
    tile.style.left = x * 32 + 'px';
    tile.style.bottom = y * 32 + 'px';
    backgroundCanvas.appendChild(tile);
    objectsArray.push(tile);
    tileArray.push([x, y]);
}

const createTileBlack = (x, y = 0) => {
    let tileBlack = document.createElement('img');
    tileBlack.src = './assets/1 Tiles/Tile_04.png';
    tileBlack.style.position = 'absolute';
    tileBlack.style.left = x * 32 + 'px';
    tileBlack.style.bottom = y * 32 + 'px';
    objectsArray.push(tileBlack);
    backgroundCanvas.appendChild(tileBlack);
}

const createTilesPlatform = (startX, endX, floor) => {
    for (let x_pos = startX - 1; x_pos < endX; x_pos++) {
        createTile(x_pos, floor);
    }
}


const createTilesBlackBlock = (startX, endX, floor) => {
    for (let y_pos = 0; y_pos < floor; y_pos++) {
        for (let x_pos = startX - 1; x_pos < endX; x_pos++) {
            createTileBlack(x_pos, y_pos);
        }
    }

}

const addTiles = (i) => {
    createTile(i);
    createTileBlack(i);
}

class Enemy {
    ATTACK = 'attack';
    DEATH = 'death';
    IDLE = 'idle';
    HURT = 'hurt';
    WALK = 'walk';

    state;
    animateWasChanged;

    startX;
    posX;
    posY;
    img;
    block;
    blockSize;
    spritePos;
    spriteMaxPos;
    timer;
    dir;
    sourcePath;
    stop;
    lives;

    constructor(x, y, src) {
        this.posX = x + this.getRandomOffset(10);
        this.startX = x;
        this.posY = y;
        this.blockSize = 96;
        this.spritePos = 0;
        this.spriteMaxPos = 3;
        this.sourcePath = src;
        this.dir = 1;

        this.state = this.IDLE;
        this.animateWasChanged = false;
        this.stop = false;
        this.lives = 30;

        this.createImg();
        this.changeAnimate(this.WALK)
        enemiesArray.push(this);
        this.lifeCycle();

    }
    createImg() {
        this.block = document.createElement('div');
        this.block.style.position = 'absolute';
        this.block.style.left = this.posX * 32 + 'px';
        this.block.style.bottom = this.posY * 32 + 'px';
        this.block.style.width = this.blockSize + 'px';
        this.block.style.height = this.blockSize + 'px';
        this.block.style.overflow = 'hidden';

        this.img = document.createElement('img');
        this.img.src = this.sourcePath + 'Idle.png';
        this.img.style.position = 'absolute';
        this.img.style.left = 0;
        this.img.style.bottom = 0;
        this.img.style.width = this.blockSize * 4 + 'px';
        this.img.style.height = this.blockSize + 'px';

        this.block.appendChild(this.img);
        canvas.appendChild(this.block);
    }
    lifeCycle() {
        this.timer = setInterval(() => {

            if (this.animateWasChanged) {
                this.animateWasChanged = false;
                switch (this.state) {
                    case this.ATTACK: {
                        this.setAttack();
                        break;
                    }
                    case this.IDLE: {
                        this.setIdle();
                        break;
                    }
                    case this.DEATH: {
                        this.setDeath();
                        break;
                    }
                    case this.HURT: {
                        this.setHurt();
                        break;
                    }
                    case this.WALK: {
                        this.setWalk();
                        break;
                    }
                    default: break;
                }
            }

            this.spritePos++;
            this.checkCollide();
            if (!this.stop) {
                this.move();
            } else {
                if (this.state != this.DEATH) {
                    if (this.state != this.HURT) {
                        this.changeAnimate(this.ATTACK);
                    }
                }

            }
            this.animate();
        }, 150)
    }
    animate() {
        if (this.spritePos > this.spriteMaxPos) {
            this.spritePos = 0;
            if (this.state === this.ATTACK) {
                lives--;
                updateHearts();
            }
            if (this.state === this.HURT) {
                this.changeAnimate(this.ATTACK);
                if (this.dir > 0) this.spritePos = 1;
            }
            if (this.state === this.DEATH) {
                clearInterval(this.timer);
                isLeftSideBlocked = false;
                isRightSideBlocked = false;
                if (this.dir > 0) this.spritePos = 5;
            }
        }
        this.img.style.left = - (this.spritePos * this.blockSize) + 'px';
    }
    setAttack() {
        this.img.src = this.sourcePath + 'Attack.png';
        this.spriteMaxPos = 5;
        this.img.style.width = this.blockSize * 6 + 'px';
    }
    setDeath() {
        this.img.src = this.sourcePath + 'Death.png';
        this.spriteMaxPos = 5;
        this.img.style.width = this.blockSize * 6 + 'px';
    }
    setHurt() {
        this.img.src = this.sourcePath + 'Hurt.png';
        this.spriteMaxPos = 1;
        this.img.style.width = this.blockSize * 2 + 'px';
    }
    setIdle() {
        this.img.src = this.sourcePath + 'Idle.png';
        this.img.style.width = this.blockSize * 4 + 'px';
        this.spriteMaxPos = 3;
    }
    setWalk() {
        this.img.src = this.sourcePath + 'Walk.png';
        this.spriteMaxPos = 5;
        this.img.style.width = this.blockSize * 6 + 'px';
    }
    changeAnimate(stateStr) {
        this.state = stateStr;
        this.animateWasChanged = true;
    }
    move() {
        if (this.posX > (this.startX + 10)) {
            this.dir *= -1;
            this.img.style.transform = 'scale(-1, 1)';
        } else if (this.posX == this.startX) {
            this.dir = Math.abs(this.dir);
            this.img.style.transform = 'scale(1, 1)';
        }
        this.posX += this.dir;
        this.block.style.left = this.posX * 32 + 'px';
    }
    checkHurt() {
        if (wasHeroHit) {
            if (this.lives <= 10) {
                wasHeroHit = false;
                this.changeAnimate(this.DEATH);
            } else {
                wasHeroHit = false;
                this.changeAnimate(this.HURT);
                this.showHurt();
                this.lives -= 10;
            }

        }
    }
    checkCollide() {
        if (heroY == this.posY) {
            if (heroX == this.posX) {
                if (hit) {
                    this.changeAnimate(this.HURT);
                }
                this.checkHurt();
                isRightSideBlocked = true;
                this.stop = true;
                //attack left side
            } else if (heroX == (this.posX + 3)) {
                if (hit) {
                    this.changeAnimate(this.HURT);
                }
                this.checkHurt();
                isLeftSideBlocked = true;
                this.stop = true;
                //attack right side
            } else {
                isLeftSideBlocked = false;
                isRightSideBlocked = false;
                this.stop = false;
                this.changeAnimate(this.WALK);
            }
        } else {
            isLeftSideBlocked = false;
            isRightSideBlocked = false;
            this.stop = false;
            this.changeAnimate(this.WALK);
        }
    }
    showHurt() {
        let pos = 0;
        let text = document.createElement('p');
        text.innerText = '-10';
        text.style.position = 'absolute';
        text.style.left = (this.dir < 0) ? Number.parseInt(this.block.style.left) + 50 + 'px' : Number.parseInt(this.block.style.left) + 10 + 'px';
        text.style.bottom = Number.parseInt(this.block.style.bottom) + 32 + 'px';
        text.style.fontFamily = "'Bungee Spice',cursive";

        let hurtTimer = setInterval(() => {
            text.style.bottom = Number.parseInt(text.style.bottom) + 16 + 'px';
            if (pos > 2) {
                clearInterval(hurtTimer);
                text.style.display = 'none';
            }
            pos++;
        }, 100);
        canvas.appendChild(text);
    }
    moveLeft() {
        this.startX -= 1;
        this.posX -= 1;
        if (this.stop || this.state === this.DEATH) {
            this.block.style.left = Number.parseInt(this.block.style.left) - 32 + 'px';
        }
    }
    moveRight() {
        this.startX += 1;
        this.posX += 1;
        if (this.stop || this.state === this.DEATH) {
            this.block.style.left = Number.parseInt(this.block.style.left) + 32 + 'px';
        }
    }
    getRandomOffset(max) {
        let rand = Math.floor(Math.random() * max);
        return rand;
    }
}

class Enemy1 extends Enemy {
    constructor(x, y) {
        super(x, y, './assets/Enemies/1/')
    }

}

class Enemy2 extends Enemy {
    constructor(x, y) {
        super(x, y, './assets/Enemies/2/');
    }
    setAttack() {
        this.img.src = this.sourcePath + 'Attack.png';
        this.spriteMaxPos = 8;
        this.img.style.width = this.blockSize * 9 + 'px';
    }
    setDeath() {
        this.img.src = this.sourcePath + 'Death.png';
        this.spriteMaxPos = 5;
        this.img.style.width = this.blockSize * 6 + 'px';
    }
    setWalk() {
        this.img.src = this.sourcePath + 'Walk.png';
        this.spriteMaxPos = 3;
        this.img.style.width = this.blockSize * 6 + 'px';
    }
}

class Enemy5 extends Enemy {
    constructor(x, y) {
        super(x, y, './assets/Enemies/5/')
    }
    setAttack() {
        this.img.src = this.sourcePath + 'Attack.png';
        this.spriteMaxPos = 3;
        this.img.style.width = this.blockSize * 4 + 'px';
    }
    setDeath() {
        this.img.src = this.sourcePath + 'Death.png';
        this.spriteMaxPos = 2;
        this.img.style.width = this.blockSize * 3 + 'px';
    }
    setWalk() {
        this.img.src = this.sourcePath + 'Walk.png';
        this.spriteMaxPos = 3;
        this.img.style.width = this.blockSize * 4 + 'px';
    }
}

class Enemy6 extends Enemy {
    bullet;
    isShoot;
    bulletX;

    constructor(x, y) {
        super(x, y, './assets/Enemies/6/');
        this.bullet = document.createElement('img');
        this.bullet.src = this.sourcePath + 'Ball1.png';
        this.bullet.style.position = 'absolute';
        this.bullet.style.left = Number.parseInt(this.block.style.left) + 'px';
        this.bullet.style.bottom = Number.parseInt(this.block.style.bottom) + 32 + 'px';
        this.bullet.style.transform = 'scale(2,2)';
        this.bullet.style.display = 'none';
        canvas.appendChild(this.bullet);
    }
    setAttack() {
        this.img.src = this.sourcePath + 'Attack.png';
        this.spriteMaxPos = 3;
        this.img.style.width = this.blockSize * 4 + 'px';
    }
    setDeath() {
        this.img.src = this.sourcePath + 'Death.png';
        this.spriteMaxPos = 2;
        this.img.style.width = this.blockSize * 3 + 'px';
    }
    setWalk() {
        this.img.src = this.sourcePath + 'Walk.png';
        this.spriteMaxPos = 3;
        this.img.style.width = this.blockSize * 4 + 'px';
    }
    checkCollide() {
        if (heroY == this.posY) {
            this.stop = true;
            if (heroX > this.posX) {
                this.dir = 1;
                this.img.style.transform = 'scale(1,1)';
            } else {
                this.dir = -1;
                this.img.style.transform = 'scale(-1,1)';
            }
            if (heroX == this.posX) {
                if (hit) {
                    this.changeAnimate(this.HURT);
                }
                this.checkHurt();
                isRightSideBlocked = true;
                //this.stop = true;
                //attack left side
            } else if (heroX == (this.posX + 3 + 'px')) {
                if (hit) {
                    this.changeAnimate(this.HURT);
                }
                this.checkHurt();
                isLeftSideBlocked = true;
                //this.stop = true;
                //attack right side
            } else {
                isLeftSideBlocked = false;
                isRightSideBlocked = false;
                //this.stop = false;
                this.changeAnimate(this.WALK);
            }
        } else {
            isLeftSideBlocked = false;
            isRightSideBlocked = false;
            //this.stop = false;
            this.changeAnimate(this.WALK);
        }
    }
    animate() {
        if (this.spritePos > this.spriteMaxPos) {
            this.spritePos = 0;
            if (this.state === this.ATTACK) {
                if(!this.isShoot) this.shoot();
                //lives--;
                //updateHearts();
            }
            if (this.state === this.HURT) {
                this.changeAnimate(this.ATTACK);
                if (this.dir > 0) this.spritePos = 1;
            }
            if (this.state === this.DEATH) {
                clearInterval(this.timer);
                isLeftSideBlocked = false;
                isRightSideBlocked = false;
                if (this.dir > 0) this.spritePos = 5;
            }
        }
        if (this.isShoot && this.state === this.ATTACK) {
            this.bulletFunc();
        } else {
            this.bullet.style.display = 'none'; 
        }
        this.img.style.left = - (this.spritePos * this.blockSize) + 'px';
    }
    shoot() {
        this.isShoot = true;
        this.bullet.style.display = 'block';
        (this.dir > 0) ? this.bulletX = this.posX + 2 : this.bulletX = this.posX + 1;
    }
    bulletFunc() {
        (this.dir > 0) ? this.bulletX += 1 : this.bulletX -= 1;
        this.bullet.style.left = this.bulletX * 32 + 'px';
        if (this.bulletX === heroX && this.posY === heroY) {
            this.isShoot = false;
            this.bullet.style.display = 'none';
            lives--;
            updateHearts();
        }
        if (this.dir > 0) {
            if (this.bulletX > (this.posX + 6)) {
                this.isShoot = false;
                this.bullet.style.display = 'none';
            }
        } else {
            if (this.bulletX < (this.posX - 6)) {
                this.isShoot = false;
                this.bullet.style.display = 'none';
            }
        }
    }
}

class Heart {
    img;
    x;
    constructor(x, src) {
        this.x = x + 1;
        this.img = document.createElement('img');
        this.img.src = src;
        this.img.style.position = 'absolute';
        this.img.style.left = this.x * 32 + 'px';
        this.img.style.bottom = ((window.screen.height / 32) - 2) * 32 + 'px';
        this.img.style.width = 32 + 'px';
        this.img.style.height = 32 + 'px';

        canvas.appendChild(this.img);
    }
}

class HeartEmpty extends Heart {
    constructor(x) {
        super(x, './assets/Hearts/heart_empty.png');
    }
}

class HeartRed extends Heart {
    constructor(x) {
        super(x, './assets/Hearts/heart_red.png');
    }
}

const addHearts = () => {
    for (let i = 0; i < maxLives; i++) {
        let heartEmpty = new HeartEmpty(i);
        let heartRed = new HeartRed(i);
        heartsArray.push(heartRed);
    }
}

const updateHearts = () => {
    if (lives < 1) {
        lives = 1;
    }
    for (let i = 0; i < lives; i++) {
        heartsArray[i].img.style.display = 'block';
    }

    for (let i = lives; i < maxLives; i++) {
        heartsArray[i].img.style.display = 'none';
    }
}

const createBackImg = (i) => {
    let img = document.createElement('img');
    img.src = './assets/2 Background/Day/Background.png';
    img.style.position = 'absolute';
    img.style.left = (i * window.screen.width) - 32 + 'px';
    img.style.bottom = '32px';
    img.style.width = window.screen.width + 'px';
    backgroundCanvas.appendChild(img);
    objectsArray.push(img);
}

const addBackgroundImages = () => {
    for (let i = 0; i < 3; i++) {
        createBackImg(i);
    }
}

const createImgEl = (src, x, y) => {
    let img = document.createElement('img');
    img.src = src;
    img.style.position = 'absolute';
    img.style.left = x * 32 + 'px';
    img.style.bottom = y * 32 + 'px';
    img.style.transform = 'scale(2,2) translate(-25%,-25%)';
    backgroundCanvas.appendChild(img);
    objectsArray.push(img);

}

const addDecorationElements = (f1, f2, f3) => {
    let basePath = './assets/3 Objects/';

    //Trees
    createImgEl(basePath + 'Other/Tree4.png', 4, f1);
    createImgEl(basePath + 'Other/Tree2.png', 35, f1);
    createImgEl(basePath + 'Other/Tree3.png', 78, f1);
    createImgEl(basePath + 'Other/Tree4.png', 108, f1);
    createImgEl(basePath + 'Other/Tree1.png', 65, f2);
    //Stones
    createImgEl(basePath + 'Stones/4.png', 10, f1);
    createImgEl(basePath + 'Stones/5.png', 111, f1);
    createImgEl(basePath + 'Stones/3.png', 38, f1);
    createImgEl(basePath + 'Stones/6.png', 102, f3);
    //Ramp
    createImgEl(basePath + 'Other/Ramp1.png', 22, f2);
    createImgEl(basePath + 'Other/Ramp2.png', 26, f2);
    createImgEl(basePath + 'Other/Ramp1.png', 95, f2);
    createImgEl(basePath + 'Other/Ramp2.png', 99, f2);
    createImgEl(basePath + 'Other/Ramp1.png', 45, f2);
    createImgEl(basePath + 'Other/Ramp2.png', 49, f2);
    //Bushes
    createImgEl(basePath + 'Bushes/17.png', 84, f1);
    createImgEl(basePath + 'Bushes/17.png', 13, f3);
    createImgEl(basePath + 'Bushes/18.png', 19, f2);
    createImgEl(basePath + 'Bushes/18.png', 50, f2);
    createImgEl(basePath + 'Bushes/18.png', 69, f2);
    createImgEl(basePath + 'Bushes/18.png', 100, f2);
    //Fountain 
    createImgEl(basePath + 'Fountain/2.png', 116, f1);
    //Boxes
    createImgEl(basePath + 'Other/Box.png', 84, f1);
    createImgEl(basePath + 'Other/Box.png', 48, f2);
    createImgEl(basePath + 'Other/Box.png', 14, f3);
    createImgEl(basePath + 'Other/Box.png', 104, f3);
}

const addEnemies = () => {
    let enemy1 = new Enemy1(7, 9);
    let enemy2 = new Enemy6(19, 5);
    let enemy3 = new Enemy5(40, 5);
    let enemy4 = new Enemy2(62, 5);
    let enemy5 = new Enemy1(79, 1);
    let enemy6 = new Enemy6(93, 5);
    let enemy7 = new Enemy2(100, 9);
}

const buildLevel = () => {
    let floor1 = 0;
    let floor2 = 4;
    let floor3 = 8;

    addDecorationElements(floor1 + 1, floor2 + 1, floor3 + 1);


    createTilesPlatform(0, 14, floor1);
    createTilesPlatform(33, 41, floor1);
    createTilesPlatform(76, 91, floor1);
    createTilesPlatform(106, 132, floor1);

    createTilesPlatform(15, 32, floor2);
    createTilesPlatform(42, 53, floor2);
    createTilesPlatform(64, 75, floor2);
    createTilesPlatform(92, 105, floor2);

    createTilesPlatform(8, 20, floor3);
    createTilesPlatform(54, 63, floor3);
    createTilesPlatform(75, 87, floor3);
    createTilesPlatform(99, 111, floor3);

    createTilesBlackBlock(15, 32, floor2);
    createTilesBlackBlock(42, 53, floor2);
    createTilesBlackBlock(64, 75, floor2);
    createTilesBlackBlock(92, 105, floor2);
    createTilesBlackBlock(54, 63, floor3);

    addEnemies();
}

const start = () => {
    addBackgroundImages();
    buildLevel();
    lifeCycle();
    addHearts();
    updateHearts();
};



start();