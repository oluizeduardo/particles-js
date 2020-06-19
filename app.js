const canvas = document.getElementById("canvas-base");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// the list of particles.
let particlesArray;

// get mouse position
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 80) * (canvas.width / 80)
}

// Add mouseEvent.
window.addEventListener('mousemove', function(mouseEvent){
    mouse.x = mouseEvent.x;
    mouse.y = mouseEvent.y;
});

// create particle.
class Particle{
    constructor(x, y, directionX, directionY, size, color){
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    // method to draw individual particle.
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    // It checks particle position, mouse position, move the particle, draw the particle.
    update(){
        // It checks if the particle is still within the canvas.
        this.checkParticlePosition();

        // Check collision detection.
        this.checkCollisionDetection();

        // move particle.
        this.moveParticle();

        // draw particle.
        this.draw();
    }

    moveParticle() {
        this.x += this.directionX;
        this.y += this.directionY;
    }

    checkCollisionDetection() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let JUMP = 3;// How many pixels the particle will jump when hit the radius.
        
        // check the distance between the particle and the mouse position.
        if (distance < mouse.radius + this.size) {
            // check if the particle comes from the right side.
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += JUMP;
            }
            // check if the particle comes from the left side.
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= JUMP;
            }
            // check if the particle comes from the top.
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += JUMP;
            }
            // check if the particle comes from the bottom.
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= JUMP;
            }
            this.directionX = -this.directionX;
            this.directionY = -this.directionY;
        }
    }

    checkParticlePosition() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }
    }
}

function connect(){
    let opacityValue = 1;
    for(let a = 0; a < particlesArray.length; a++){
        for(let b = a; b < particlesArray.length; b++){
            let distance = Math.pow((particlesArray[a].x - particlesArray[b].x), 2) + 
                           Math.pow((particlesArray[a].y - particlesArray[b].y), 2);
            
            if(distance < (canvas.width / 7) * (canvas.height / 7)){
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = 'rgba(140,85,31,'+opacityValue+')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth, innerHeight);

    for(let i = 0; i < particlesArray.length; i++){
        particlesArray[i].update();
    }
    connect();
}

function init(){
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;

    for(let i = 0; i < numberOfParticles; i++){
        let size = (Math.random() * 5) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);

        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;

        let color = '#8C5523';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Event to readjust the size of the canvas when resize the screen.
window.addEventListener('resize', 
    function(){
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = Math.pow((canvas.height / 80) , 2);
        init();
    }
);

window.addEventListener('mouseout', 
    function(){
        mouse.x = undefined;
        mouse.y = undefined;
    }
);

init();
animate();