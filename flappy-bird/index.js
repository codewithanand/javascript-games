let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

//set size
canvas.width = 288;
canvas.height = 512;

//load images
const bird = new Image();
const bg = new Image();
const fg = new Image();
const pipeNorth = new Image();
const pipeSouth = new Image();


bird.src = "bird.png";
bg.src = "bg.png";
fg.src = "fg.png";
pipeNorth.src = "pipeNorth.png";
pipeSouth.src = "pipeSouth.png";

//Load sounds
var move = new Audio();
var scor = new Audio();

move.src = "fly.mp3";
scor.src = "score.mp3";


//variables
var gap = 85;
var constant = pipeNorth.height + gap

var birdX = 10;
var birdY = 150;

var gravity = 1.25 ;

var score = 0;

//Key event
window.addEventListener('keydown', fly);
function fly(){
    birdY -= 27;
    move.play();
}

//pipes coordinates
var pipe = [];
pipe[0] = {
    x: canvas.width,
    y: 0
}

//draw images
let animationId;
function draw(){
    animationId = requestAnimationFrame(draw);
    ctx.clearRect(0,0, canvas.width, canvas.height);

    ctx.drawImage(bg, 0,0);

    for(var i=0; i<pipe.length; i++){
        ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
        ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y+constant);
        pipe[i].x--;

        if(pipe[i].x === 100){
            pipe.push({
                x: canvas.width,
                y: Math.floor(Math.random()*pipeNorth.height)-pipeNorth.height
            });
        }

        //detect collision
        if((birdX+bird.width>=pipe[i].x && birdX<=pipe[i].x+pipeNorth.width && (birdY<=pipe[i].y+pipeNorth.height || birdY+bird.height>=pipe[i].y+constant)) || birdY+bird.height>= canvas.height-fg.height){
            cancelAnimationFrame(animationId); //reload the page
        }

        //set score
        if(pipe[i].x == 5){
            score++;
            scor.play();
        }

        //popping pipes
        if(pipe[i].x+pipeNorth.width<0){
            pipe.splice(i, 1);
        }
    }
    ctx.drawImage(fg, 0, canvas.height-fg.height);

    ctx.drawImage(bird, birdX, birdY);

    birdY += gravity;

     
    ctx.fillStyle = '#000';
    ctx.font = '20px verdana';
    ctx.fillText('Score: '+ score, 100, canvas.height-20)

}
draw();