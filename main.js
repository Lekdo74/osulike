import { HitCircle } from "./HitCircle.js";

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const hitCircles = [];

// Example hit circles (these could be loaded from a level or pattern)
hitCircles.push(new HitCircle(300, 200, 80, Date.now() + 1000));
hitCircles.push(new HitCircle(500, 300, 80, Date.now() + 2000));

function gameLoop() {
    const currentTime = Date.now();

    update(currentTime);
    draw(currentTime);

    // Continue the game loop
    requestAnimationFrame(gameLoop);
}

function update(currentTime) {
    for (let i = hitCircles.length - 1; i >= 0; i--) {
        if (hitCircles[i].shouldDespawn(currentTime)) {
            hitCircles.splice(i, 1);
        } else {
            hitCircles[i].draw(ctx, currentTime);
        }
    }
}

function draw(currentTime) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    hitCircles.forEach(circle => {
        circle.draw(ctx, currentTime);
    });
}

gameLoop();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const currentTime = Date.now();

    hitCircles.forEach(circle => {
        if (circle.checkHit(mouseX, mouseY, currentTime)) {
            console.log('Hit!');
        }
    });
});