//Переменные
let heroImg = document.querySelector('#hero-img');

let jumpBlock = document.querySelector('#jump-block');
jumpBlock.style.top = `${window.screen.height / 2 - 144 / 2}px`;


let hitBlock = document.querySelector('#hit-block');
hitBlock.style.top = `${window.screen.height / 2 - 144 / 2}px`;

let hero = document.querySelector('#hero');
let rightPosition = 0;
let imgBlock = document.querySelector('#img-block');
imgBlock.style.bottom = '64px';
imgBlock.style.left = '0px';
let imgBlockPosition = 0;
let x = 0;
let halfWidth = window.screen.width / 2;
let tileArray = [];
let canvas = document.querySelector('#canvas');
let fsBtn = document.querySelector('#fsbtn');
let timer = null;
let direction = 'right';
let hit = false;
let jump = false;
let fall = false;

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
    imgBlock.style.bottom = `${Number.parseInt(imgBlock.style.bottom) - 40}px`;
    checkFalling();
}

const rightHandler = () => {
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

const leftHandler = () => {
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
            }
            break;
        }
        case 'left': {
            heroImg.style.transform = 'scale(1,1)';
            if (rightPosition > 3) {
                rightPosition = 0;
                hit = false;
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
    canvas.appendChild(tile);

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
    canvas.appendChild(tileBlack);
}

class Enemy {
    posX;
    posY;
    img;
    block;
    blockSize;
    spritePos;
    spriteMaxPos;
    timer;
    constructor(x, y) {
        this.posX = x;
        this.posY = y;
        this.blockSize = 96;
        this.spritePos = 0;
        this.spriteMaxPos = 3;

        this.createImg();
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
        this.img.src = './assets/Enemies/1/Idle.png';
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
            this.spritePos++;
            this.animate();
        }, 150)
    }
    animate() {
        if (this.spritePos > this.spriteMaxPos) {
            this.spritePos = 0;
        }
        this.img.style.left = -(this.spritePos * this.blockSize) + 'px';
    }

}

const start = () => {
    lifeCycle();
    for (let i = 0; i < 50; i++) {
        /*         if ((i > 10) && (i < 17)) {
                    continue;
                } */
        addTiles(i);
    }
    let enemy = new Enemy(10, 2);
};
start();
createTilesPlatform(10, 10, 10);
createTilesPlatform(15, 5, 10);