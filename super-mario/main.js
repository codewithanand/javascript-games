let canvas = document.querySelector('canvas');
let c = canvas.getContext('2d');

//set canvas size
canvas.width = 500;
canvas.height = 217;

//load images
const background = new Image();
const rock = new Image();
const pyp = new Image();
const mario = new Image();
const td = new Image();

background.src = "images/worlds/world-1-1.png";
rock.src = "images/tileset/rock-1.png";
pyp.src = "images/tileset/pipe-1.png";


mario.src = "images/mario/sm-1.png";
td.src = "images/enemy/td-1.png";


//load sounds
var jumpSound = new Audio();
var gameOverSound = new Audio();
var bumpSound = new Audio();



jumpSound.src = "sounds/Jump.wav";
gameOverSound.src = "sounds/Die.wav";
bumpSound.src = "sounds/Bump.wav";



//setting variables
var bgX = 0;
var bgY = 0;
var bottomWidth = 23;
var ground = canvas.height - bottomWidth;

var playerWidth = mario.width;
var playerHeight = mario.height;
var playerX = 100;
var playerY = ground-playerHeight;

var enemyWidth = td.width;
var enemyHeight = td.height;
var enemyX = 400;
var enemyY = ground-enemyHeight;

var steps = 2;
const gravity = 2; 
const antiGravity = 60;
var dir = '';
var leftBound;
var rightBound;

//Background
class Background{
    constructor(img, x, y,){
        this.x = x;
        this.y = y;
        this.img = img;
    }
    draw(){
        c.drawImage(this.img, this.x, this.y);
    }

    update(){
        this.draw();
    }
}


//Mario
class Mario{
    constructor(img, x, y, width, height){
        this.img = img;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    draw(){
        c.drawImage(this.img, this.x, this.y);
    }

    update(){
        this.draw();
    }
}

//Toad
class Enemy{
    constructor(img, x, y, width, height){
        this.img = img;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    draw(){
        c.drawImage(this.img, this.x, this.y);
    }

    update(){
        this.draw();
    }
}


//creating objects
var rockGround = [];

var bg = new Background(background, bgX, bgY);
var player = new Mario(mario, playerX, playerY, playerWidth, playerHeight);

var toad = new Enemy(td, enemyX, enemyY, enemyWidth, enemyHeight);

//setting enemy bound
leftBound = toad.x-50;
rightBound = toad.x+toad.width+50

//rendering world
function world(){
    
    //ground
    for(var i=0; i<canvas.width; i+=rock.width){
        for(var j=canvas.height-2*rock.height; j<canvas.height; j+=rock.height){
            c.drawImage(rock, i*rock.width, canvas.height-(j+1)*rock.height);
            
        }
    }

}

//when player moves
window.addEventListener('keydown', movePlayer);
function movePlayer(event){
    //setting left movement
    if(event.keyCode === 37){
        event.preventDefault();
        dir = 'left';
        mario.src = "images/mario/sm-2-l.png";
        if(player.x < 200){
            if(bg.x===0){
                bg.x=0
                player.x-=steps;
            }else{
                bg.x += steps;
            }
        }else{
            player.x-=steps;
        }
    }
    //setting right movement
    if(event.keyCode === 39){
        event.preventDefault();
        dir = 'right';
        mario.src = "images/mario/sm-2.png";
        //set background move
        if(player.x+mario.width > canvas.width/2){
            bg.x -= steps;
        }else{
            player.x+=steps;
        }
    }
    //setting jump
    if(event.keyCode === 32){
        event.preventDefault();
        if(dir === 'left'){
            mario.src = "images/mario/sm-6-l.png";
        }
        if(dir === 'right'){
            mario.src = "images/mario/sm-6.png";
        }
        player.y-=antiGravity;
        jumpSound.play();
    }
}
window.addEventListener('keyup', (event)=>{
    event.preventDefault();
    if(dir === 'left'){
        mario.src = "images/mario/sm-1-l.png";
    }
    if(dir === 'right'){
        mario.src = "images/mario/sm-1.png";
    }
});

//render on canvas
let animationId;
function animate(){
    animationId = requestAnimationFrame(animate);
    c.clearRect(0,0, canvas.width, canvas.height);
    bg.update();
    player.update();
    toad.update();
    world();


    //setting boundaries
    if(player.x<0){
        player.x = 0;
    }
    if(player.y>ground-player.height){
        player.y = ground-player.height;
    }


    //setting free fall 
    if(player.y < ground-player.height){
        player.y += gravity;
    }

    //Enemy to move towards player
    if(toad.x - player.x+mario.width < canvas.width/2 - 50){
        toad.x -= steps;
    }else{
        if(toad.x < leftBound || toad.x > rightBound){
            toad.x = -steps;
        }
    }

    //when player kills enemy
    if((player.x+mario.width===toad.x || player.x===toad.x+td.width)&&player.y+mario.height>=ground-td.height){
        td.src = "images/enemy/td-3.png";
        bumpSound.play();

        player.y= toad.y - player.height ;
        toad.x = toad.x;
    }

    //setting game over
    if((player.x+mario.width>=toad.x && player.x<=toad.x+td.width)&&player.y+player.height===ground){
        gameOverSound.play();
        mario.src = "images/mario/sm-7.png";
        canceable
        player.y -= 100;
        player.update();
        //cancelAnimationFrame(animationId);
    }
    
} 
animate();