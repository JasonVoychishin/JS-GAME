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
imgBlock.style.bottom = '64px';
imgBlock.style.left = '0px';
let imgBlockPosition = 0;
let x = 0;
let halfWidth = window.screen.width / 2;
let tileArray = [];
let maxLives = 6;
let lives = 6;
let heartsArray = [];
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
//Функции

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

const rightHandler = () => {
    if (!isRightSideBlocked) {
        heroImg.style.transform = 'scale(-1,1)';
        rightPosition = rightPosition + 1;
        imgBlockPosition = imgBlockPosition + 1;
        if (rightPosition > 5) {
            rightPosition = 0;
        }
        heroImg.style.left = `-${rightPosition * 96}px`;
        heroImg.style.top = '-192px';
        imgBlock.style.left = `${imgBlockPosition * 20}px`;

        checkFalling();
    }

}

const leftHandler = () => {
    if (!isLeftSideBlocked) {
        heroImg.style.transform = 'scale(1,1)';
        rightPosition = rightPosition + 1;
        imgBlockPosition = imgBlockPosition - 1;
        if (rightPosition > 5) {
            rightPosition = 0;
        }
        heroImg.style.left = `-${rightPosition * 96}px`;
        heroImg.style.top = '-192px';
        imgBlock.style.left = `${imgBlockPosition * 20}px`;

        checkFalling();
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
            checkFalling();
    }

    rightPosition = rightPosition + 1;
    heroImg.style.left = `-${rightPosition * 96}px`;
    heroImg.style.top = '0px';
}

let onTouchStart = (event) => {
    clearInterval(timer);
    if (event.type === 'mousedown') {
        x = event.screenX;
    } else {
        console.log(event);
        x = event.touches[0].screenX;
    };
    timer = setInterval(() => {
        if (x > halfWidth) {
            direction = 'right';
            rightHandler()
        } else {
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
    switch (direction) {
        case 'right': {
            heroImg.style.transform = 'scale(-1,1)';
            if (rightPosition > 4) {
                rightPosition = 1;
                jump = false;
                imgBlock.style.bottom = `${Number.parseInt(imgBlock.style.bottom) + 160}px`;
                imgBlockPosition = imgBlockPosition + 10;
                imgBlock.style.left = `${imgBlockPosition * 20}px`;
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
                imgBlockPosition = imgBlockPosition - 10;
                imgBlock.style.left = `${imgBlockPosition * 20}px`;
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
window.ontouchstart = onTouchStart;
window.ontouchend = onTouchEnd;

heroImg.onclick = (event) => {
    event.preventDefault();
}

fsBtn.onclick = () => {
    if (document.fullscreenElement) {
        fsBtn.src = './fullscreen.png';
        document.exitFullscreen()
    } else {
        canvas.requestFullscreen();
        fsBtn.src = './cancel.png';
    }
}

jumpBlock.onclick = () => {
    jump = true;
};

hitBlock.onclick = () => {
    hit = true;
};

const createTile = (x, y = 1) => {
    let tile = document.createElement('img');
    tile.src = './assets/1 Tiles/Tile_02.png';
    tile.style.position = 'absolute';
    tile.style.left = x * 32 + 'px';
    tile.style.bottom = y * 32 + 'px';
    backgroundCanvas.appendChild(tile);

    tileArray.push([x, y]);
}

const createTilesPlatform = (startX, startY, length) => {
    for (let i = 0; i < length; i++)
        createTile(startX + i, startY);
}

const addTiles = (i) => {
    createTile(i);
    let tileBlack = document.createElement('img');
    tileBlack.src = './assets/1 Tiles/Tile_04.png';
    tileBlack.style.position = 'absolute';
    tileBlack.style.left = i * 32 + 'px';
    tileBlack.style.bottom = 0;
    backgroundCanvas.appendChild(tileBlack);
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

    constructor(x, y) {
        this.posX = x;
        this.startX = this.posX;
        this.posY = y;
        this.blockSize = 96;
        this.spritePos = 0;
        this.spriteMaxPos = 3;
        this.sourcePath = './assets/Enemies/1/';
        this.dir = 1;

        this.state = this.IDLE;
        this.animateWasChanged = false;
        this.stop = false;

        this.createImg();
        this.changeAnimate(this.WALK)
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
                if (this.state != this.HURT) {
                    this.changeAnimate(this.ATTACK);
                }
            }
            if (wasHeroHit) {
                wasHeroHit = false;
                this.changeAnimate(this.HURT);
                this.showHurt();
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
                if (this.state === this.HURT) {
                    this.changeAnimate(this.ATTACK);
                }
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
    checkCollide() {
        if (heroY == this.posY) {
            if (heroX == this.posX) {
                if (hit) {
                    this.changeAnimate(this.HURT);
                } else {
                    this.changeAnimate(this.ATTACK);
                }
                isRightSideBlocked = true;
                this.stop = true;
                //attack left side
            } else if (heroX == (this.posX + 3 + 'px')) {
                if (hit) {
                    this.changeAnimate(this.HURT);
                } else {
                    this.changeAnimate(this.ATTACK);
                }
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
        text.style.left = Number.parseInt(this.block.style.left) + 50 + 'px';
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

const start = () => {
    lifeCycle();
    for (let i = 0; i < (window.screen.width / 32); i++) {
        addTiles(i);
    }
    let enemy = new Enemy(10, 2);
    addHearts();
    updateHearts();
};

start();
createTilesPlatform(10, 10, 10);
createTilesPlatform(15, 5, 10);