//--------------------------------------------------------START OF JAVASCRIPT------------------------------------------------------------------------------------------\\

var canvas = document.getElementById('canv');
var c = canvas.getContext('2d');

window.onload = function () {
    start();
    setInterval(update, 10);
}

function songIsPlaying(audiolem) {
    return !audiolem.paused;
}

class Particle {
    constructor(x, y, r, type) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.type = type;
    }
    show() {
        c.fillStyle = (this.type === 'flame') ? "orange" : "gray";
        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        c.fill();
        c.closePath();
    }
    update() {
        if (this.type === 'flame') {
            if (this.r < 70) {
                this.r += 2;
            }
        }
    }
}

//classes
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 60;
        this.h = 100;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.takingDamage = false;
		this.switch9 = true;
    }
    show() {
        //c.fillStyle = 'gray';
        //c.fillRect(this.x, this.y, this.w, this.h);
        c.drawImage(player, this.x, this.y, this.w, this.h);
        //draw health bar
        c.fillStyle = 'lightgreen';
        c.fillRect(this.x - 10, this.y + this.h + 10, this.w + 20, 10);
        //draw red part of health bar
        if (health <= 0) {
            damageWidth = -80;
        }
        c.fillStyle = 'red';
        c.fillRect(this.x - 10 + this.w + 20, this.y + this.h + 10, damageWidth, 10);
        //flash player red if taking damage
        if (this.takingDamage) {
            c.fillStyle = 'red';
            c.globalAlpha = 0.3;
            c.fillRect(this.x, this.y, this.w, this.h);
            c.globalAlpha = gameObjectsOp;
        }
    }
    shoot() {
        if (canShoot) {
            shootAudio.play();
            var b = new Bullet(this.x + 5, this.y, this);
            var b1 = new Bullet(this.x + this.w - 10, this.y, this);
            bullets.push(b);
            bullets.push(b1);
            canShoot = false;
            shootAudio.currentTime = 0;
        }
    }
    update() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        if (this.y < 500) {
            this.ySpeed = 0
        }
        if (this.y >= 600) {
            this.ySpeed = 0;
        }
        if (health <= 0) {
            flashX = p.x + p.w / 2;
            flashY = p.y + p.h / 2;

            //this.ySpeed = 3;
            //explode player
            //c.fillStyle = 'yellow';
            //c.beginPath();
            //c.arc(flashX, flashY, flashW, 0, 2 * Math.PI);
            //c.fill();
            //c.closePath();
			c.drawImage(cImg, p.x-50, p.y, 160, 160);
			if (this.switch9) {
				setTimeout(function() {
					explosionAnimation();
				}, 150)
				this.switch9 = false;
			}
            if (flashW < 80) {
                flashW += 3;
            }
            if (flashH < 80) {
                flashH += 3;
            }
            //flashY+=5;
            //flashX+=5;
            setTimeout(function () {
                atDeathScreen = true;
            }, 500)
        }
    }
}

class Bullet {
    constructor(x, y, owner) {
        this.x = x;
        this.y = y;
        this.w = 5;
        this.h = 30;
        this.owner = owner;
        this.xSpeed = 0;
        this.ySpeed = (this.owner === p) ? -5 : 5;
        this.damaged = false;
    }
    show() {
        c.fillStyle = 'red';
        c.fillRect(this.x, this.y, this.w, this.h);
    }
    update() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        if (this.x + this.w > p.x && this.x < p.x + p.w && this.y + this.h > p.y && this.y < p.y + p.h && !this.damaged && this.owner != p) {
            damagePlayer();
            p.takingDamage = true;
            setTimeout(function () {
                p.takingDamage = false;
            }, 50);
            this.damaged = true;
        }
        for (let i = 0; i < enemies.length; i++) {
            var e = enemies[i];
            if (this.x + this.w > e.x && this.x < e.x + e.w && this.y + this.h > e.y && this.y < e.y + e.h && !this.damaged && this.owner === p && !e.dead) {
                e.timesShot++;
                e.takingDamage = true;
                if (e.timesShot >= currentEnemyShotsToKill) {
                    e.dead = true;
                    enemiesRemainingInWave--;
                    score += 5;
                    document.getElementById("score").innerHTML = "Score: " + score;
                    if (currentWave > 5) {
                        ammo += 2;
                    } else {
                        ammo += 5;
                    }
                    document.getElementById("ammo").innerHTML = "Ammo Remaining: " + ammo;
                    healPlayer();
                }
                this.damaged = true;
            }
        }
    }
}

class Enemy {
    constructor(x, y, shotsToKill) {
        this.x = x;
        this.y = y;
        this.w = 60;
        this.h = 100;
        this.startX = x;
        this.armed = (Math.floor(Math.random() * 5)) ? true : false;
        this.dead = false;
        this.timesShotInRow = 0;
        this.maxTimesShotInRow = 5;
        this.canShoot2 = true;
        this.timeWaitingFromRow = 0;
        this.timeTillCanShootFromRow = 1;
        this.shotsToKill = shotsToKill;
        this.timesShot = 0;
        this.takingDamage = false;
        this.showingGiveText = false;
        this.switch2 = true;
        this.switch3 = true;
        if (this.armed) {
            this.img = armedImage;
            this.canShoot = false;
            this.reloadTime = 1;
            this.timeSinceShoot = 0;
            this.readyToShoot = false;
        }
        if (!this.armed) {
            if (this.startX === -100) {
                this.img = rightImage;
            } else {
                this.img = leftImage;
            }
            this.w = 100;
            this.h = 60;
        }
    }
    show() {
        // c.lineWidth = 10;
        // c.strokeStyle = 'white';
        // c.strokeRect(this.x, this.y, this.w, this.h);
        // c.fillStyle = 'gray';
        // c.fillRect(this.x, this.y, this.w, this.h);
        if (!this.dead) {
            c.drawImage(this.img, this.x, this.y, this.w, this.h);
            //flash red
            if (this.takingDamage) {
                c.fillStyle = 'red';
                c.globalAlpha = 0.3;
                c.fillRect(this.x, this.y, this.w, this.h);
                c.globalAlpha = gameObjectsOp;
            }
        }
        if (this.switch2) {
            setTimeout(function () {
                this.switch2 = false;
            }, 1000)
        }
        //remove flash
        var en = this;
        if (this.takingDamage) {
            setTimeout(function () {
                en.takingDamage = false;
            }, 50)
        }
        if (this.dead) {
            //show text on death
            if (this.showingGiveText) {
                if (this.switch3) {
                    c.font = "30px Impact";
                    c.fillStyle = 'lightgreen';
                    if (currentWave > 5) {
                        c.fillText("+1 Health   +2 Ammo", this.x - 50, this.y + 50);
                    } else {
                        c.fillText("+1 Health   +5 Ammo", this.x - 50, this.y + 50);
                    }
                    var notThis = this;
                    setTimeout(function () {
                        notThis.switch3 = false;
                    }, 500)
                }
            }
            if (this.switch2) {
                this.showingGiveText = true;
            } else {
                this.showingGiveText = false;
            }
        }
    }
    shoot() {
        enemyShootAudio.play();
        var b = new Bullet(this.x + 5, this.y + this.h, this);
        var b1 = new Bullet(this.x + this.w - 10, this.y + this.h, this);
        bullets.push(b);
        bullets.push(b1);
        this.canShoot = false;
        this.timesShotInRow++;
        enemyShootAudio.currentTime = 0;
    }
    update() {
        if (!this.dead) {
            if (this.timesShotInRow >= this.maxTimesShotInRow) {
                this.canShoot2 = false;
            }
            if (!this.canShoot2) {
                this.timeWaitingFromRow += 0.01;
                if (this.timeWaitingFromRow >= this.timeTillCanShootFromRow) {
                    this.canShoot2 = true;
                    this.timeWaitingFromRow = 0;
                    this.timesShotInRow = 0;
                }
            }
            if (this.startX === -100) {
                this.x += 5;
            }
            if (this.startX === 900) {
                this.x -= 5;
            }
            if (this.armed) {
                if (!this.canShoot) {
                    this.timeSinceShoot += 0.1;
                    if (this.timeSinceShoot >= this.reloadTime) {
                        this.timeSinceShoot = 0;
                        this.canShoot = true;
                    }
                }
            }
            if (this.x + this.w > p.x - 50 && this.x < p.x + p.w + 50) {
                this.readyToShoot = true;
            } else {
                this.readyToShoot = false;
            }
            if (this.canShoot && this.readyToShoot && this.canShoot2) {
                this.shoot();
            }
            //move enemy back if off screen
            if (this.startX === -100) {
                if (this.x >= 900) {
                    this.startX = 900;
                    if (!this.armed) {
                        this.img = leftImage;
                    }
                }
            }
            if (this.startX === 900) {
                if (this.x <= -100) {
                    this.startX = -100;
                    if (!this.armed) {
                        this.img = rightImage;
                    }
                }
            }
        }
    }
}

class Star {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.moving = false;
        this.currentSpeed = 0;
        this.maxSpeed = 5;
        this.timeMoving = 0;
    }
    show() {
        c.fillStyle = 'white';
        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        c.fill();
        c.closePath();
    }
    update() {
        if (moving) {
            this.timeMoving += 0.1;
            if (this.currentSpeed < this.maxSpeed) {
                this.currentSpeed += 0.1;
            }
        }
        if (this.timeMoving >= 5) {
            if (this.currentSpeed > 0.1) {
                this.currentSpeed -= 0.1;
            }
            if (this.currentSpeed <= 0.1) {
                this.currentSpeed = 0;
                this.timeMoving = 0;
            }
        }
        this.y += this.currentSpeed * this.r;
    }
}

var p;
var bullets = [];
//shooting
var mouseDown = false;
var canShoot = false;
var timeReloading = 0;
var reloadTime = 1;
//enemies
var enemies = [];
var currentEnemyShotsToKill = 1;
//wave system
var currentWave;
var enemiesToSpawnInWave = 5;
var enemiesRemainingInWave = enemiesToSpawnInWave;
var enemiesSpawned = 0;
var waveEnded = false;
var needStart = true;
var inNewWave = true;
//spawn rate is the time it takes for an enemy to spawn in milliseconds
var spawnRate = 1000;
var amountToSpawn = 1;
//images
var armedImage = document.getElementById("armed");
var leftImage = document.getElementById("left");
var rightImage = document.getElementById("right");
var playerImg = document.getElementById("player");
var ex1 = document.getElementById("ex1");
var ex2 = document.getElementById("ex2");
var ex3 = document.getElementById("ex3");
var cImg = ex1;
//health and damage
var health = 10;
var damageWidth = 0;
//explosion
var particles = [];
var part;
var flashX = 0;
var flashY = 0;
var flashW = 1;
var flashH = 1;
//score
var score = 0;
//ammo
var ammo = 10;
//make movement smoother
var lastKeyPressed;
var newKey;
var timeHoldingRight = 0;
var timeHoldingLeft = 0;
var holdingLeft = false;
var holdingRight = false;
//text
var giveTexts = [];
//stars
var stars = [];
var moving = true;
var needsMove = true;
//main menu and death screen
var atMainMenu = true;
var atDeathScreen = false;
var mainMenuStars = [];
var loopInterval;
var switch4 = true;
var loadingToGame = false;
var backgroundOp = 0.0;
var elementsOp = 1.0;
var gameObjectsOp = 1;
//audio
var shootAudio;
var enemyShootAudio;
var song;
var playingSong = false;

function start() {
    //spawn main menu stars
    for (let i = 0; i < 25; i++) {
        var starM = new Star(random(0, 800), random(0, 800), random(1, 5));
        mainMenuStars.push(starM);
    }
    //load audio
    shootAudio = new Audio("data/shoot.wav");
    shootAudio.volume = 0.1;
    enemyShootAudio = new Audio("data/shoot.wav");
    enemyShootAudio.volume = 0.04;
    song = new Audio("data/song.wav");
}

function update() {
    if (atMainMenu) {
        if (!loadingToGame) {
            //background
            c.fillStyle = 'rgb(0, 10, 31)';
            c.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
            //stars
            for (let i = 0; i < mainMenuStars.length; i++) {
                mainMenuStars[i].show();
                mainMenuStars[i].update();
                if (mainMenuStars[i].y > 900) {
                    mainMenuStars[i].y = random(-100, 0);
                    mainMenuStars[i].x = random(0, 800);
                }
            }
        } else {
            c.globalAlpha = backgroundOp;
            c.fillStyle = 'rgb(0, 10, 31)';
            c.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
            c.globalAlpha = gameObjectsOp;
            document.getElementById("mainTitle").style.opacity = elementsOp;
            document.getElementById("play").style.opacity = elementsOp;
            document.getElementById("tutorial").style.opacity = elementsOp;
            backgroundOp+=0.001;
            elementsOp-=0.01;
        }
    } else if (atDeathScreen) {
        //background
        c.fillStyle = 'darkred';
        c.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        //show and hide elements
        document.getElementById("ammo").style.display = "none";
        if (score < 10) {
            document.getElementById("score").style.top+=80;
        } else if (score < 100 && score > 10) {
            document.getElementById("score").style.top+=65;
        } else if (score < 1000 && score > 100) {
            document.getElementById("score").style.top+=55;
        } else {
            document.getElementById("score").style.top+=45;
        }
        document.getElementById("score").style.left = 310;
        document.getElementById("deathText").style.display = "block";
        document.getElementById("back").style.display = "block";
    } else {
        c.globalAlpha = gameObjectsOp;
        //background
        c.fillStyle = 'rgb(0, 10, 31)';
        c.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        //stars
        for (let i = 0; i < stars.length; i++) {
            stars[i].show();
            stars[i].update();
        }
        //player
        p.show();
        p.update();
        if (mouseDown && canShoot && ammo > 0) {
            p.shoot();
            ammo--;
            document.getElementById("ammo").innerHTML = "Ammo Remaining: " + ammo;
        }
        if (!canShoot) {
            timeReloading += 0.1;
            if (timeReloading >= reloadTime) {
                canShoot = true;
                timeReloading = 0;
            }
        }
        //bullets
        for (let i = 0; i < bullets.length; i++) {
            bullets[i].show();
            bullets[i].update();
        }
        //enemies
        for (let i = 0; i < enemies.length; i++) {
            enemies[i].show();
            enemies[i].update();
        }
        //particles
        if (part != null) {
            part.show();
            part.update();
        }
        //wave system
        if (waveEnded && needStart) {
            setTimeout(function () {
                changeWave();
                enemiesSpawned = 0;
                waveEnded = false;
                spawnEnemy();
                needStart = true;
            }, 3000);
            needStart = false;
        }
        if (!songIsPlaying(song)) {
            song.currentTime = 0;
            song.play();
        }
    }
}

function keyDown(e) {
    switch (e.keyCode) {
        case 39:
            holdingRight = true;
            timeHoldingRight++;
            p.xSpeed = 5;
            break;
        case 37:
            holdingLeft = true;
            timeHoldingLeft++;
            p.xSpeed = -5;
            break;
        case 38:
            if (p.y > 500) {
                p.ySpeed = -5;
            }
            break;
        case 40:
            if (p.y < 600) {
                p.ySpeed = 5;
            }
            break;
        case 17:
            mouseDown = true;
            break;
    }
}

function keyUp(e) {
    switch (e.keyCode) {
        case 39:
            if (!holdingLeft) {
                p.xSpeed = 0;
            }
            holdingRight = false;
            timeHoldingRight = 0;
            break;
        case 37:
            if (!holdingRight) {
                p.xSpeed = 0;
            }
            holdingLeft = false;
            timeHoldingLeft = 0;
            break;
        case 38:
            p.ySpeed = 0;
            break;
        case 40:
            p.ySpeed = 0;
            break;
        case 17:
            mouseDown = false;
            break;
    }
}

document.onkeydown = keyDown;
document.onkeyup = keyUp;
document.onmousedown = function () {
    if (!songIsPlaying(song) && !atDeathScreen) {
        song.play();
    }
    mouseDown = true;
}
document.onmouseup = function () {
    mouseDown = false;
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function changeWave() {
    currentWave++;
    enemiesToSpawnInWave += 5;
    enemiesRemainingInWave = enemiesToSpawnInWave;
    if (spawnRate > 100) {
        spawnRate -= 100;
    }
    if (currentWave % 2 != 0 && currentWave >= 4) {
        currentEnemyShotsToKill++;
    }
}

function spawnEnemy() {
    if (enemiesSpawned < enemiesToSpawnInWave) {
        var e = new Enemy((Math.floor(Math.random() * 2) ? -100 : 900), random(50, 400), currentEnemyShotsToKill);
        enemies.push(e);
        enemiesSpawned++;
        setTimeout(spawnEnemy, spawnRate);
    } else {
        endWave();
    }
}

function damagePlayer() {
    health--;
    damageWidth -= 8;
}

function healPlayer() {
    if (health < 10) {
        health++;
        damageWidth += 8
    }
}

function spawnStars() {
    var star = new Star(random(0, 800), random(-32000, 800), random(1, 5));
    stars.push(star);
}

function endWave() {
    if (enemiesRemainingInWave <= 0) {
        waveEnded = true;
    }
    if (needsMove && waveEnded) {
        moving = true;
        needsMove = false;
        for (let i = 0; i < bullets.length; i++) {
            bullets.splice(i);
        }
        setTimeout(function () {
            moving = false;
            needsMove = true;
        }, 2000);
    }
    if (!waveEnded) {
        setTimeout(endWave, 10);
    }
}

function play() {
    loadingToGame = true;
    setTimeout(function() {
        p = new Player(370, 600);
        currentWave = 1;
        //spawn enemies
        spawnEnemy();
        //spawn stars
        for (let i = 0; i < 1000; i++) {
            spawnStars();
        }
    
        atMainMenu = false;
        //remove and show elements
        document.getElementById("mainTitle").style.display = "none";
        document.getElementById("play").style.display = "none";
        document.getElementById("tutorial").style.display = "none";
        document.getElementById("score").style.display = "block";
        document.getElementById("ammo").style.display = "block";
        //stop stars
        moving = false;
    }, 2000)
}

function back() {
    location.reload();
}

function explosionAnimation() {
	cImg = ex1;
	setTimeout(function() {
		cImg = ex2;
	}, 150)
	setTimeout(function() {
		cImg = ex3;
	}, 300)
}

function tutorial() {
    document.write("<h1>How To Play Warp Attack: </h1>");
    document.write("<h2>The goal of Warp Attack is to survive for as long as possible. Use the arrow keys to move the player left, right, up, and down. To shoot, use left click on your mouse, or you can use the CONTROL or CTRL key on your keyboard. You start with 10 ammo. You get ammo as you kill enemies. Once you kill all the enemies in one place, you will move to another place automatically. You also will get +1 health when you kill an enemy. The health bar is below the player.</h2>");
    document.write("<button onclick='location.reload();'>Click here to go back to main menu</button>");
}

//-----------------------------------------------------END OF JAVASCRIPT-----------------------------------------------------------------------------------------------\\