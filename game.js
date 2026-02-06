const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

/* ================= PLAYER ================= */
const player = {
    x: 450,
    y: 250,
    size: 25,
    speed: 4,
    health: 100
};

/* ================= DATA ================= */
let bullets = [];
let enemies = [];
let score = 0;
let keys = {};

/* ================= INPUT ================= */
document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

document.addEventListener("keydown", e => {
    if (e.code === "Space") shoot();
});

/* ================= SHOOT ================= */
function shoot() {
    bullets.push({
        x: player.x + player.size / 2,
        y: player.y,
        r: 5,
        speed: 8
    });
}

/* ================= ENEMIES ================= */
function spawnEnemy() {
    enemies.push({
        x: Math.random() * (canvas.width - 30),
        y: Math.random() < 0.5 ? 0 : canvas.height,
        size: 25,
        speed: 1.5,
        health: 30
    });
}
setInterval(spawnEnemy, 1200);

/* ================= UPDATE ================= */
function update() {

    /* Player movement */
    if (keys["w"] && player.y > 0) player.y -= player.speed;
    if (keys["s"] && player.y < canvas.height - player.size) player.y += player.speed;
    if (keys["a"] && player.x > 0) player.x -= player.speed;
    if (keys["d"] && player.x < canvas.width - player.size) player.x += player.speed;

    /* Bullets */
    bullets.forEach((b, i) => {
        b.y -= b.speed;
        if (b.y < 0) bullets.splice(i, 1);
    });

    /* Enemies chase player */
    enemies.forEach((e, ei) => {
        let dx = player.x - e.x;
        let dy = player.y - e.y;
        let dist = Math.hypot(dx, dy);

        e.x += (dx / dist) * e.speed;
        e.y += (dy / dist) * e.speed;

        /* Damage player */
        if (dist < 25) {
            player.health -= 0.3;
            if (player.health <= 0) gameOver();
        }
    });

    /* Bullet collision */
    bullets.forEach((b, bi) => {
        enemies.forEach((e, ei) => {
            let d = Math.hypot(b.x - e.x, b.y - e.y);
            if (d < e.size) {
                e.health -= 10;
                bullets.splice(bi, 1);

                if (e.health <= 0) {
                    enemies.splice(ei, 1);
                    score += 10;
                }
            }
        });
    });
}

/* ================= DRAW ================= */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* Player */
    ctx.fillStyle = "cyan";
    ctx.fillRect(player.x, player.y, player.size, player.size);

    /* Bullets */
    ctx.fillStyle = "yellow";
    bullets.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
    });

    /* Enemies */
    ctx.fillStyle = "red";
    enemies.forEach(e => {
        ctx.fillRect(e.x, e.y, e.size, e.size);
    });

    /* HUD */
    ctx.fillStyle = "white";
    ctx.fillText("Health: " + Math.floor(player.health), 10, 20);
    ctx.fillText("Score: " + score, 10, 40);
}

/* ================= GAME LOOP ================= */
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function gameOver() {
    alert("GAME OVER! Score: " + score);
    location.reload();
}

gameLoop();
