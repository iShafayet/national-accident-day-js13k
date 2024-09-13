import { Game } from "./Game";

import { CANVAS_BASE_HEIGHT, CANVAS_BASE_WIDTH } from "../constants";
import { GameState } from "./GameState";

export class Road {
  game: Game;
  roadStart: number;
  rocksAndStones: { x: number; y: number; width: number; height: number; }[];

  constructor(game: Game) {
    this.game = game;
    this.roadStart = -40;
    this.rocksAndStones = [
      { x: 10, y: 100, width: 20, height: 15 },
      { x: 15, y: 250, width: 15, height: 12 },
      { x: 20, y: 400, width: 18, height: 14 },
      { x: CANVAS_BASE_WIDTH - 30, y: 150, width: 22, height: 16 },
      { x: CANVAS_BASE_WIDTH - 35, y: 300, width: 16, height: 13 },
      { x: CANVAS_BASE_WIDTH - 25, y: 450, width: 19, height: 15 }
    ];
  }

  updateState() {
    if (this.game.state !== GameState.STARTED) {
      return;
    }
    
    this.roadStart += this.game.level.enemySpeedFactor * this.game.baseSpeed * this.game.pc.speedFactor;
    if (this.roadStart >= 0) {
      this.roadStart = -40;
    }

    // // Add a new random rock when roadStart reaches 30
    // if (this.roadStart === -30) {
    //   const newRock = {
    //     x: Math.random() < 0.5 ? Math.random() * 30 : CANVAS_BASE_WIDTH - Math.random() * 30 - 25,
    //     y: -20, // Start above the canvas
    //     width: 15 + Math.random() * 10,
    //     height: 12 + Math.random() * 5
    //   };
    //   this.rocksAndStones.unshift(newRock);

    //   // Optionally, remove the last rock if the array gets too large
    //   if (this.rocksAndStones.length > 20) {
    //     this.rocksAndStones.pop();
    //   }
    // }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const xMargin = 40; // Set margin on both sides

    // Draw the road
    ctx.fillStyle = "#808080"; // Gray color for the road
    ctx.fillRect(xMargin, this.roadStart, CANVAS_BASE_WIDTH - 2 * xMargin, CANVAS_BASE_HEIGHT - this.roadStart);

    // Calculate lane width
    const laneWidth = (CANVAS_BASE_WIDTH - 2 * xMargin) / 4;

    // Draw lane markings
    ctx.lineWidth = 5;

    // Draw lane dividers
    for (let i = 1; i < 4; i++) {
      ctx.strokeStyle = i == 2 ? "#FFD700" : "white";
      const x = xMargin + i * laneWidth;
      ctx.setLineDash([20, 20]); // Dashed line
      ctx.beginPath();
      ctx.moveTo(x, this.roadStart);
      ctx.lineTo(x, CANVAS_BASE_HEIGHT);
      ctx.stroke();
    }

    // Draw road dividers (edges)
    ctx.strokeStyle = "yellow"; // Different color for road dividers
    ctx.setLineDash([]); // Solid line
    ctx.beginPath();
    ctx.moveTo(xMargin, this.roadStart);
    ctx.lineTo(xMargin, CANVAS_BASE_HEIGHT);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(CANVAS_BASE_WIDTH - xMargin, this.roadStart);
    ctx.lineTo(CANVAS_BASE_WIDTH - xMargin, CANVAS_BASE_HEIGHT);
    ctx.stroke();

    // Reset line dash to solid for future drawing operations
    ctx.setLineDash([]);

    // // Draw rocks and stones on the side of the road
    // this.rocksAndStones.forEach(rock => {
    //   const adjustedY = (rock.y + this.roadStart) % CANVAS_BASE_HEIGHT;

    //   // Create a more irregular shape for each rock
    //   ctx.beginPath();
    //   ctx.moveTo(rock.x, adjustedY);
    //   ctx.lineTo(rock.x + rock.width * 0.3, adjustedY - rock.height * 0.2);
    //   ctx.lineTo(rock.x + rock.width * 0.7, adjustedY - rock.height * 0.1);
    //   ctx.lineTo(rock.x + rock.width, adjustedY + rock.height * 0.3);
    //   ctx.lineTo(rock.x + rock.width * 0.8, adjustedY + rock.height);
    //   ctx.lineTo(rock.x + rock.width * 0.2, adjustedY + rock.height * 0.9);
    //   ctx.closePath();

    //   // Add a gradient to give depth to the rock
    //   const gradient = ctx.createLinearGradient(rock.x, adjustedY, rock.x + rock.width, adjustedY + rock.height);
    //   gradient.addColorStop(0, "#696969");  // Dark gray
    //   gradient.addColorStop(0.5, "#808080"); // Medium gray
    //   gradient.addColorStop(1, "#A9A9A9");  // Light gray

    //   ctx.fillStyle = gradient;
    //   ctx.fill();

    //   // Add some highlights
    //   ctx.strokeStyle = "#C0C0C0"; // Silver color for highlights
    //   ctx.lineWidth = 1;
    //   ctx.stroke();
    // });
  }
}
