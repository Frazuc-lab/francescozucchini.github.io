// Load duck-rabbit image
const duckRabbitImg = new Image();
duckRabbitImg.src = "duck-rabbit.png"; 

// Draw hand-drawn pipe (white instead of green)
function drawPipe(pipe) {
    ctx.fillStyle = '#FFFFFF'; // white pipes

    // Top pipe
    ctx.fillRect(pipe.x, 0, CONFIG.pipe_width, pipe.topHeight);

    // Bottom pipe
    ctx.fillRect(pipe.x, pipe.bottomY, CONFIG.pipe_width, CONFIG.canvas_height - pipe.bottomY);

    // Hand-drawn outlines
    drawHandDrawnLine(pipe.x, 0, pipe.x, pipe.topHeight);
    drawHandDrawnLine(pipe.x + CONFIG.pipe_width, 0, pipe.x + CONFIG.pipe_width, pipe.topHeight);
    drawHandDrawnLine(pipe.x, pipe.topHeight, pipe.x + CONFIG.pipe_width, pipe.topHeight);

    drawHandDrawnLine(pipe.x, pipe.bottomY, pipe.x, CONFIG.canvas_height);
    drawHandDrawnLine(pipe.x + CONFIG.pipe_width, pipe.bottomY, pipe.x + CONFIG.pipe_width, CONFIG.canvas_height);
    drawHandDrawnLine(pipe.x, pipe.bottomY, pipe.x + CONFIG.pipe_width, pipe.bottomY);

    // Pipe caps (light gray for subtle shading)
    ctx.fillStyle = '#DDDDDD';
    ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, CONFIG.pipe_width + 10, 20);
    ctx.fillRect(pipe.x - 5, pipe.bottomY, CONFIG.pipe_width + 10, 20);

    // Outline the caps
    drawHandDrawnLine(pipe.x - 5, pipe.topHeight - 20, pipe.x + CONFIG.pipe_width + 5, pipe.topHeight - 20);
    drawHandDrawnLine(pipe.x - 5, pipe.topHeight, pipe.x + CONFIG.pipe_width + 5, pipe.topHeight);
    drawHandDrawnLine(pipe.x - 5, pipe.topHeight - 20, pipe.x - 5, pipe.topHeight);
    drawHandDrawnLine(pipe.x + CONFIG.pipe_width + 5, pipe.topHeight - 20, pipe.x + CONFIG.pipe_width + 5, pipe.topHeight);

    drawHandDrawnLine(pipe.x - 5, pipe.bottomY, pipe.x + CONFIG.pipe_width + 5, pipe.bottomY);
    drawHandDrawnLine(pipe.x - 5, pipe.bottomY + 20, pipe.x + CONFIG.pipe_width + 5, pipe.bottomY + 20);
    drawHandDrawnLine(pipe.x - 5, pipe.bottomY, pipe.x - 5, pipe.bottomY + 20);
    drawHandDrawnLine(pipe.x + CONFIG.pipe_width + 5, pipe.bottomY, pipe.x + CONFIG.pipe_width + 5, pipe.bottomY + 20);
}
