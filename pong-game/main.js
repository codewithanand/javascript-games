let canvas = document.querySelector('canvas');
let c = canvas.getContext('2d');


canvas.width = innerWidth;
canvas.height = innerHeight;

colorArray =[
    '#52057b',
    '#16a596',
    '#e05297',
    '#d37815',
    '#af6b58',
    '#ea2c62',
    '#214252',
    '#3797a4',
    '#db6400',
    '#ffa62b'
];

class Paddle{
    constructor(x, y, width, length){
        this.x = x;
        this.y = y;
        this.color = `${colorArray[Math.floor(Math.random()*colorArray.length)]}`;
        this.width = width;
        this.length = length;
        this.step = 15;
        this.score = 0;
    }
    draw(){
        c.beginPath();
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, this.width, this.length);
        c.fill();
    }
    update(){
        this.draw();
    }
}
class Ball{
    constructor(x, y, radius, velocity){
        this.x = x;
        this.y = y;
        this.color = 'white';
        this.radius = radius;
        this.velocity = velocity;
        this.dir = '';
    }
    draw(){
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        c.fill();
    }
    update(){
        //ball initial velocity must not be 0
        if(this.velocity.x===0){
            this.velocity.x +=2;
        }
        if(this.velocity.y ===0){
            this.velocity.y +=2;
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.draw();
    }
}
class Redball{
    constructor(x, y, radius, velocity){
        this.x = x;
        this.y = y;
        this.color = 'red';
        this.radius = radius;
        this. velocity = velocity;
    }
    draw(){
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        c.fill();
    }
    update(){
        //this.x += this.velocity;
        this.y += this.velocity;

        this.draw();
    }
}
class GreenBall{
    constructor(x, y, radius, velocity){
        this.x = x;
        this.y = y;
        this.color = 'green';
        this.radius = radius;
        this. velocity = velocity;
    }
    draw(){
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        c.fill();
    }
    update(){
        this.x += this.velocity;
        this.y += this.velocity;

        this.draw();
    }
}
class BlueBall{
    constructor(x, y, radius, velocity){
        this.x = x;
        this.y = y;
        this.color = 'blue';
        this.radius = radius;
        this. velocity = velocity;
    }
    draw(){
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        c.fill();
    }
    update(){
        this.x += this.velocity;
        this.y += this.velocity;

        this.draw();
    }
}


//setting variables
let paddleLength = 120;
let paddleWidth = 20;
let gap = 50;

let ballX = canvas.width/2;
let ballY = canvas.height/2;
let ballRadius = 10;

let player1X = gap;
let player1Y =  canvas.height/2 - paddleLength/2;

let player2X = canvas.width - paddleWidth - gap;
let player2Y =  canvas.height/2 - paddleLength/2;

let playerTurn = 0;

let enemyArray = [];    //red ball
let healthArray = [];   //green ball
let speedArray = [];    //blue ball

let flag = 0;

//creating objects
let player1 = new Paddle(player1X, player1Y, paddleWidth, paddleLength);

let player2 = new Paddle(player2X, player2Y, paddleWidth, paddleLength);

let ball = new Ball(ballX, ballY,ballRadius, {
    x: Math.floor((Math.random()*4) + 1),
    y: Math.floor((Math.random()*4) + 1)
});


//Methods
function displayScore(player1, player2){
    
    //player1
    c.fillStyle = 'red';
    c.font = '60px verdana';
    c.fillText(player1, canvas.width/2-180, 70);

    //player2
    c.fillStyle = 'blue';
    c.font = '60px verdana';
    c.fillText(player2, canvas.width/2+120, 70);

}

function spawnEnemy(){
    let radius = 4;
    let velocity = 4;
    let x = Math.floor((Math.random()*400) +180);
    let y = Math.floor((Math.random()*400) +100);
    enemyArray.push(new Redball(x, y, radius, velocity));
}

function gameOver(winner){
    let gameOverText = 'Game Over';
    let whoWinsText = `Player ${winner} wins`;
    c.fillStyle = 'red';
    c.font = '60px Verdana';
    c.fillText(gameOverText, canvas.width/2 - 180, canvas.height/2);
    c.fillStyle = 'blue';
    c.font = '30px Verdana';
    c.fillText(whoWinsText, canvas.width/2 - 110, canvas.height/2 + 50);
}





let animationId;
function animate(){
    animationId = requestAnimationFrame(animate);
    c.clearRect(0,0, canvas.width, canvas.height);
    displayScore(player1.score, player2.score);
    player1.update();
    player2.update();
    ball.update();

    healthArray.forEach((greenBall, index)=>{
        greenBall.update();

        //limiting green ball
        if(greenBall.x<50 || greenBall.x>canvas.width-50 || greenBall.y<20 || greenBall.y>canvas.height-20){
            greenBall.velocity = -greenBall.velocity;
        }

        //when ball hits green ball
        let dist = Math.hypot(greenBall.x-ball.x, greenBall.y-ball.y);
        if(dist<greenBall.radius+ball.radius){
            if(playerTurn===1){
                player1.length += 10;   //Player 1 paddle length increases
            }
            if(playerTurn===2){
                player2.length += 10;   //Player 2 paddle length increases
            }
            healthArray.splice(index, 1);
        }
    });

    speedArray.forEach((blueBall, index)=>{
        blueBall.update();

        //limiting blue ball
        if(blueBall.x<100 || blueBall.x>canvas.width-100 || blueBall.y<20 || blueBall.y>canvas.height-100){
            blueBall.velocity = -blueBall.velocity;
        }

        //when ball hits blue ball
        let dist = Math.hypot(blueBall.x-ball.x, blueBall.y-ball.y);
        if(dist<blueBall.radius+ball.radius){
            if(playerTurn===1){
                player1.step += 5;   //Player 1 paddle speed increases
            }
            if(playerTurn===2){
                player2.step += 5;   //Player 2 paddle speed increases
            }
            speedArray.splice(index, 1);
        }
    });

    enemyArray.forEach((redBall, index)=>{
        redBall.update();

        //limiting red ball
        if(redBall.y<redBall.radius || redBall.y>canvas.height-redBall.radius){
            redBall.velocity = -redBall.velocity;
        }

        //when ball hits red ball
        let dist = Math.hypot(redBall.x-ball.x, redBall.y-ball.y);
        if(dist<ball.radius+redBall.radius){
            if(playerTurn===1){
                player1.score -= 10;
                player1.length -= 10;   //Player 1 paddle length decreases
            }
            else if(playerTurn===2){
                player2.score -= 10;
                player2.length -= 10;   //Player 2 paddle length decreases
            }
            enemyArray.splice(index, 1);
            enemyArray.push(new Redball(
                Math.floor((Math.random()*400) +180),
                Math.floor((Math.random()*400) +100),
                4,
                4
            ));
            healthArray.push(new GreenBall(
                Math.floor((Math.random()*400) +180),
                Math.floor((Math.random()*400) +100),
                8,
                4 
            ));

        }

    });
    

    //limiting paddles
    if(player1.y<0){
        player1.y = 0;
    }if(player1.y+player1.length>canvas.height){
        player1.y= canvas.height-player1.length ;
    }
    if(player2.y<0){
        player2.y = 0;
    }if(player2.y+player2.length>canvas.height){
        player2.y= canvas.height-player2.length ;
    }

    //when ball hits paddle
    if(ball.y>= player1.y && ball.y-ball.radius <= player1.y+player1.length && ball.x-ball.radius <= player1.x+player1.width){
        //setting score
        playerTurn = 1;
        player1.score += 10;
        ball.velocity.x = -ball.velocity.x;
        //ball velocity increses
        ball.velocity.x *= 1.05;
        ball.velocity.y *= 1.05;
        //Booster appearance
        if(player1.score%20===10 || player2.score%20===30){
            if(speedArray.length<0){
                speedArray.push(new BlueBall(
                    Math.floor((Math.random()*400) +180),
                        Math.floor((Math.random()*400) +100),
                        8,
                        4 
                ));
            }
        }
    }
    if(ball.y>= player2.y && ball.y<= player2.y+player2.length && ball.x+ball.radius >= player2.x){
        //setting score
        playerTurn = 2;
        player2.score += 10;
        ball.velocity.x = -ball.velocity.x;
        //ball velocity increses
        ball.velocity.x *= 1.05;
        ball.velocity.y *= 1.05;
        //Booster appearance
        if(player1.score%20===10 || player2.score%20===30){
            if(speedArray.length===0){
                speedArray.push(new BlueBall(
                    Math.floor((Math.random()*400) +180),
                        Math.floor((Math.random()*400) +100),
                        8,
                        4 
                ));
            }
        }
    }

    

    //when ball hits top and bottom boundaries
    if(ball.y-ball.radius<0 || ball.y+ball.radius>canvas.height){
        ball.velocity.y = -ball.velocity.y;
    }

    //setting game over when ball missed by paddle
    if((ball.x-ball.radius<player1.x+player1.width && !(ball.y >= player1.y && ball.y<= player1.y+player1.length))||((ball.x+ball.radius>player2.x && !(ball.y >= player2.y && ball.y<= player2.y+player2.length)))){
        cancelAnimationFrame(animationId);
        if(ball.x>canvas.width/2){
            gameOver(1);
        }
        if(ball.x<canvas.width/2){
            gameOver(2);
        }
    }
    //setting game over when paddle diminished
    if(player1.length<20){
        cancelAnimationFrame(animationId);
        gameOver(2);
    }
    if(player2.length<20){
        cancelAnimationFrame(animationId);
        gameOver(1);
    }

}
animate();
spawnEnemy();

window.addEventListener('keydown', (event)=>{
    event.preventDefault();
    if(event.key === 'ArrowUp'){
        player2.y -= player2.step;
    }
    if(event.key === 'ArrowDown'){
        player2.y += player2.step;
    }
    if(event.key === 'w' || event.key === 'W'){
        player1.y -= player1.step;
    }
    if(event.key === 's' || event.key === 'S'){
        player1.y += player1.step;
    }
});

