function setup() {
    createCanvas(800, 600);
    textAlign(CENTER, CENTER);
    textSize(24);
    
    // Maak een grotere grid voor het dartbord
    gridSize = 50; // Vergroot de gridgrootte voor betere dartborden
    gridWidth = width / gridSize;
    gridHeight = height / gridSize;
    
    grid = [];
    for (let i = 0; i < gridWidth; i++) {
        grid[i] = [];
        for (let j = 0; j < gridHeight; j++) {
            grid[i][j] = 0;
        }
    }
    
    // Initialiseer de speler
    player = {
        x: width / 2,
        y: height - 50,
        speed: 5,
        score: 0
    };
    
    // Initialiseer de timer
    timer = 30;
    lastSecond = second();
    
    // Plaats een dartbord-target
    placeTarget();
}

function placeTarget() {
    // Kies een willekeurige positie voor het dartbord
    targetX = Math.floor(random(1, gridWidth - 1));
    targetY = Math.floor(random(1, gridHeight - 3)); // Zorg dat het dartbord niet te laag is
    
    // Markeer de positie in het grid
    grid[targetX][targetY] = 1;
}

function draw() {
    background(220);
    
    // Teken het grid en de targets
    drawGrid();
    
    // Teken de speler
    fill(255, 0, 0);
    ellipse(player.x, player.y, 20, 20);
    
    // Teken de score en timer
    fill(0);
    text("Score: " + player.score, 70, 30);
    text("Time: " + timer, width - 70, 30);
    
    // Update de timer
    if (second() != lastSecond) {
        timer--;
        lastSecond = second();
        
        if (timer <= 0) {
            gameOver();
        }
    }
    
    // Beweeg de speler
    movePlayer();
}

function drawGrid() {
    for (let i = 0; i < gridWidth; i++) {
        for (let j = 0; j < gridHeight; j++) {
            // Teken de gridlijnen
            stroke(200);
            noFill();
            rect(i * gridSize, j * gridSize, gridSize, gridSize);
            
            // Teken het dartbord als er een target is
            if (grid[i][j] === 1) {
                drawDartboard(i * gridSize + gridSize / 2, j * gridSize + gridSize / 2, gridSize * 0.9);
            }
        }
    }
}

function drawDartboard(x, y, size) {
    // Teken de buitenste ring (1 punt)
    fill(255, 0, 0);
    stroke(0);
    ellipse(x, y, size, size);
    
    // Teken de middelste ring (3 punten)
    fill(0, 0, 255);
    ellipse(x, y, size * 0.7, size * 0.7);
    
    // Teken de binnenste ring (5 punten)
    fill(255, 255, 0);
    ellipse(x, y, size * 0.4, size * 0.4);
    
    // Teken de bullseye (10 punten)
    fill(0);
    ellipse(x, y, size * 0.15, size * 0.15);
}

function mousePressed() {
    // Bereken de grid-coördinaten van de muisklik
    let gridX = Math.floor(mouseX / gridSize);
    let gridY = Math.floor(mouseY / gridSize);
    
    // Controleer of de klik op een target is
    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
        if (grid[gridX][gridY] === 1) {
            // Bereken de afstand tot het centrum van het dartbord
            let targetCenterX = gridX * gridSize + gridSize / 2;
            let targetCenterY = gridY * gridSize + gridSize / 2;
            let distance = dist(mouseX, mouseY, targetCenterX, targetCenterY);
            
            // Ken punten toe op basis van waar op het dartbord is geklikt
            let radius = gridSize * 0.9 / 2; // Straal van het dartbord
            
            if (distance < radius * 0.15) {
                // Bullseye - 10 punten
                player.score += 10;
                console.log("Bullseye! +10 punten");
            } else if (distance < radius * 0.4) {
                // Binnenste ring - 5 punten
                player.score += 5;
                console.log("Binnenste ring! +5 punten");
            } else if (distance < radius * 0.7) {
                // Middelste ring - 3 punten
                player.score += 3;
                console.log("Middelste ring! +3 punten");
            } else {
                // Buitenste ring - 1 punt
                player.score += 1;
                console.log("Buitenste ring! +1 punt");
            }
            
            // Verwijder het huidige target en plaats een nieuwe
            grid[gridX][gridY] = 0;
            placeTarget();
        }
    }
} 