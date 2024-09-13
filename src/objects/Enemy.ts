import { CANVAS_BASE_HEIGHT, CANVAS_BASE_WIDTH, ENEMY_SPEED_FACTOR } from "../constants";
import { EnemyType } from "./EnemyType";
import { Game } from "./Game";
import { GameState } from "./GameState";
import carPinkSpriteSheetFile from "../../assets/car-pink-coming.png";
import carBlueSpriteSheetFile from "../../assets/car-blue-coming.png";
import carDarkBlueSpriteSheetFile from "../../assets/car-dark-blue-coming.png";
import { doRectanglesCollide } from "../lib/math";
import { drawFireEffect } from "../lib/fire-effect";

const carPinkImage = new Image();
carPinkImage.src = carPinkSpriteSheetFile;

const carBlueImage = new Image();
carBlueImage.src = carBlueSpriteSheetFile;

const carDarkBlueImage = new Image();
carDarkBlueImage.src = carDarkBlueSpriteSheetFile;

export class Enemy {
  game: Game;

  type: EnemyType;
  speed: number;
  health: number;

  x: number;
  y: number;

  totalFrames: number;
  currentFrame: number;

  hitboxRadius: number;
  hitboxWidth: number;
  hitboxHeight: number;

  isActive: boolean;

  constructor(game: Game, type: EnemyType, lane: number) {
    this.game = game;

    const workArea = CANVAS_BASE_WIDTH - 60;

    this.x = workArea / 4 / 2 + lane * workArea / 4;
    this.y = 40;

    this.type = type;
    if (type == EnemyType.BASIC) {
      this.speed = 1;
      this.health = 2;
      this.totalFrames = 1;
    } else if (type == EnemyType.HEAVY) {
      this.speed = 0.75;
      this.health = 4;
      this.totalFrames = 1;
    } else if (type == EnemyType.FAST) {
      this.speed = 1.5;
      this.health = 1;
      this.totalFrames = 1;
    }

    this.hitboxRadius = 13;
    this.hitboxWidth = 70;
    this.hitboxHeight = 160;

    this.currentFrame = 0;

    this.isActive = true;
  }

  updateState() {
    if (this.game.state !== GameState.STARTED) {
      return;
    }

    if (this.y > CANVAS_BASE_HEIGHT - 30) {
      this.isActive = false;
      this.game.cleanupService.registerEnemyForCleanup(this);
      this.game.scoreKeeper.awardScore(100 * this.health);
      playAudioFx(0); 
    }

    this.y += this.speed * ENEMY_SPEED_FACTOR * this.game.level.enemySpeedFactor * this.game.pc.speedFactor * this.game.baseSpeed;

    let [x, y] = this.game.pc.computeCurrentCoordinates();
    const collides = doRectanglesCollide(this.x, this.y, this.hitboxWidth, this.hitboxHeight, x, y, this.game.pc.hitboxWidth, this.game.pc.hitboxHeight);

    if (collides) {
      this.game.lifeKeeper.reduceLife();
      this.game.cleanupService.registerEnemyForCleanup(this);
      playAudioFx(1); 
    }
  }

  fireArray: any[] = [];

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.isActive) {
      return;
    }

    drawFireEffect(ctx, this.x, this.y, 10, 10, this.fireArray);
    drawFireEffect(ctx, this.x + this.hitboxWidth, this.y, 10, 10, this.fireArray);

    let image: HTMLImageElement;

    if (this.type == EnemyType.BASIC) {
      image = carPinkImage;
      this.currentFrame += 0.2;
    } else if (this.type == EnemyType.FAST) {
      image = carBlueImage;
      this.currentFrame += 0.15;
    } else if (this.type == EnemyType.HEAVY) {
      image = carDarkBlueImage;
      this.currentFrame += 0.15;
    }

    let frame = Math.floor(0);
    let pieceWidth = image.width / this.totalFrames;
    let pieceHeight = image.height;

    const destinationScale = 4.5;
    ctx.drawImage(
      image,
      frame * pieceWidth,
      0,
      pieceWidth,
      pieceHeight,
      this.x - pieceWidth / 2,
      this.y - pieceHeight / 2,
      pieceWidth * destinationScale,
      pieceHeight * destinationScale
    );

    // this.drawHealth(ctx);

    if (this.currentFrame >= this.totalFrames) {
      this.currentFrame = 0;
    }

    if (this.game.inDebugMode) {
      ctx.strokeStyle = "rgba(0, 0, 0, 1)";
      ctx.strokeRect(this.x, this.y, this.hitboxWidth, this.hitboxHeight);
    }
  }

}
