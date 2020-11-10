const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

let xVelocity = document.querySelector('#dx');
let yVelocity = document.querySelector('#dy');


canvas.width = 800;
canvas.height = 600;

class Snake{
    constructor(x, y, radius, color, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.dir = '';
    }
    draw(){
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        c.fillStyle = this.color;
        c.fill();
        c.strokeStyle = 'white';
        c.stroke();
    }
    update(){
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.draw();
    }
}

class Tail{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.radius = 7;
        this.color = 'red';
    }
    draw(){
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        c.fillStyle = this.color;
        c.fill();
        c.strokeStyle = 'white';
        c.stroke();
    }
    update(){
        this.draw();
    }
}

class Enemy{
    constructor(x, y, radius, color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    draw(){
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        c.fillStyle = this.color;
        c.fill();
    }
    update(){
        this.draw();
    }
}

let x = canvas.width/2;
let y = canvas.height/2;
let player = new Snake(x,y,10,'red', {
                x: 0,
                y: 0
            });

let tails = [];
tails.push(new Tail(x-player.radius-7, y));

let enemyX = Math.floor(Math.random()*(canvas.width - 2*player.radius)) + 2*player.radius;
let enemyY = Math.floor(Math.random()*(canvas.height - 2*player.radius)) + 2*player.radius;

let enemy = new Enemy(enemyX, enemyY, 8, 'yellow');

let animationId;
function animate(){
    animationId = requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width, canvas.height);
    
    player.update();
    
    tails.forEach((tail, index)=>{

        //tails follow head
        if(player.dir === 'left'){
            tail.x = player.x + (index+1)*(player.radius + tail.radius);
            tail.y = player.y;
        }
        if(player.dir === 'up'){
            tail.x = player.x;
            tail.y = player.y + (index+1)*(player.radius + tail.radius);
        }
        if(player.dir === 'right'){
            tail.x = player.x - (index+1)*(player.radius + tail.radius);
            tail.y = player.y;
        }
        if(player.dir === 'down'){
            tail.x = player.x;
            tail.y = player.y - (index+1)*(player.radius + tail.radius);
        }
        tail.update();

        //when snake eats enemy
        var dist = Math.hypot(player.x-enemy.x, player.y-enemy.y);
        if(dist-player.radius-enemy.radius<2){

            enemyX = Math.floor(Math.random()*(canvas.width - player.radius)) + player.radius;
            enemyY = Math.floor(Math.random()*(canvas.height - player.radius)) + player.radius;
            
            enemy = new Enemy(enemyX, enemyY, 8, 'yellow');
            
            if(player.dir === 'left'){
                tails.push(new Tail(player.x + (tails.length*2*tail.radius+player.radius+tail.radius), player.y));
            }
            if(player.dir === 'up'){
                tails.push(new Tail(player.x, player.y + (tails.length*2*tail.radius+player.radius+tail.radius)));
            }
            if(player.dir === 'right'){
                tails.push(new Tail(player.x - (tails.length*2*tail.radius+player.radius+tail.radius, player.y)));
            }
            if(player.dir === 'down'){
                tails.push(new Tail(player.x, player.y - (tails.length*2*tail.radius+player.radius+tail.radius)));
            }
            
        }
    });

    enemy.update();

    //Set game Over
    if(player.x-player.radius<0 || player.x+player.radius>canvas.width || player.y-player.radius<0 || player.y+player.radius>canvas.height){
        cancelAnimationFrame(animationId);
    }

    //when snake eats enemy
    // var dist = Math.hypot(player.x-enemy.x, player.y-enemy.y);
    // if(dist-player.radius-enemy.radius<2){

         
    // }



    xVelocity.innerHTML = player.velocity.x;
    yVelocity.innerHTML = player.velocity.y;

}
window.addEventListener('keydown', (event)=>{
    if(event.key === 'ArrowLeft'){
        if(player.dir !== 'right'){
            player.dir = 'left';
            player.velocity.y = 0;
            player.velocity.x-=2;
        }else{   
            player.dir = 'right';
            player.velocity.x = player.velocity.x;
            player.velocity.y = player.velocity.y;
        }
    }
    if(event.key === 'ArrowUp'){
        if(player.dir != 'down'){
            player.dir = 'up';
            player.velocity.y -=2;
            player.velocity.x = 0;
        }else{
            player.dir = 'down';
            player.velocity.x = player.velocity.x;
            player.velocity.y = player.velocity.y;
        }
    }
    if(event.key === 'ArrowRight'){
        if(player.dir !== 'left'){
            player.dir = 'right';
            player.velocity.y = 0;
            player.velocity.x+=2;
        }else{   
            player.dir = 'left';
            player.velocity.x = player.velocity.x;
            player.velocity.y = player.velocity.y;
        }
    }
    if(event.key === 'ArrowDown'){
        if(player.dir != 'up'){
            player.dir = 'down';
            player.velocity.y +=2;
            player.velocity.x = 0;
        }else{
            player.dir = 'up';
            player.velocity.x = player.velocity.x;
            player.velocity.y = player.velocity.y;
        }
    }
})
animate();
//spawnSnake();