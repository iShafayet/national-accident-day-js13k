import { InputState } from "../InputState";
import { Game } from "./Game";
import { GameState } from "./GameState";
import pcIdleSpriteSheetFile from "../../assets/car-green-going.png";
import pcRunningSpriteSheetFile from "../../assets/car-green-going.png";
import pcShootingSpriteSheetFile from "../../assets/car-green-going.png";

import { PlayerCharacterState } from "./PlayerCharacterState";
import { mirrorImageVertical } from "../lib/utility";
import { CANVAS_BASE_HEIGHT, CANVAS_BASE_WIDTH, MAX_PLAYER_LIVES } from "../constants";
import { drawFireEffect } from "../lib/fire-effect";

const pcIdleImage = new Image();
pcIdleImage.src = pcIdleSpriteSheetFile;

const pcRunningImage = new Image();
pcRunningImage.src = pcRunningSpriteSheetFile;

const pcShootingImage = new Image();
pcShootingImage.src = pcShootingSpriteSheetFile;

export class PlayerCharacter {
  game: Game;
  state: PlayerCharacterState;
  idleStateTotalFrame: number;
  idleStateCurrentFrame: number;
  runningStateCurrentFrame: number;
  runningStateTotalFrame: number;
  shootingStateCurrentFrame: number;
  shootingStateTotalFrame: number;
  hitboxRadius: number;
  hitboxWidth: number;
  hitboxHeight: number;
  fireArray: any[] = [];

  constructor(game: Game) {
    this.game = game;
    this.state = PlayerCharacterState.IDLE;
    this.idleStateCurrentFrame = 0;
    this.idleStateTotalFrame = 1;
    this.runningStateCurrentFrame = 0;
    this.runningStateTotalFrame = 1;
    this.shootingStateCurrentFrame = 0;
    this.shootingStateTotalFrame = 1;
    this.hitboxRadius = 50;

    this.hitboxWidth = 70;
    this.hitboxHeight = 160;
  }

  xPosition = 0;
  yPosition = 0;

  xOffset = 40;
  xMin = 40;
  xMax = CANVAS_BASE_WIDTH - 140;

  yOffset = 20;
  yMin = 0;
  yMax = CANVAS_BASE_HEIGHT - 300;

  speedFactor = 1;

  movementSpeed = 20;

  public computeCurrentCoordinates(): [number, number] {
    let x = this.xOffset + this.xPosition;
    let y = this.yOffset + this.yPosition;
    return [x, y];
  }

  initialize() {
    this.xPosition = (this.xMax + this.yMin) / 4 + 60;
    this.yPosition = this.yMax;
  }

  updateState(inputState: InputState) {
    if (this.game.state !== GameState.STARTED) {
      return;
    }

    if (inputState.left) {
      if (this.xPosition > this.xMin) {
        this.xPosition -= this.movementSpeed * this.speedFactor * this.game.level.enemySpeedFactor;
      }
    }
    if (inputState.right) {
      if (this.xPosition < this.xMax) {
        this.xPosition += this.movementSpeed * this.speedFactor * this.game.level.enemySpeedFactor;
      }
    }
    if (inputState.down) {
      this.speedFactor = 0.5;
    } else if (inputState.up) {
      this.speedFactor = 1.3;
    } else {
      this.speedFactor = 1;
    }

    if (!inputState.left && !inputState.right && this.state != PlayerCharacterState.SHOOTING) {
      this.state = PlayerCharacterState.IDLE;
    }
    if (inputState.left) {
      this.state = PlayerCharacterState.MOVING_LEFT;
    }
    if (inputState.right) {
      this.state = PlayerCharacterState.MOVING_RIGHT;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    let image: HTMLImageElement;
    let currentFrame: number;
    let totalFrame: number;

    let [x, y] = this.computeCurrentCoordinates();

    if (this.state == PlayerCharacterState.IDLE) {
      image = pcIdleImage;
      this.idleStateCurrentFrame += 0.3;

      if (this.idleStateCurrentFrame >= this.idleStateTotalFrame) {
        this.idleStateCurrentFrame = 0;
      }

      currentFrame = this.idleStateCurrentFrame;
      totalFrame = this.idleStateTotalFrame;
    } else if (this.state == PlayerCharacterState.MOVING_LEFT || this.state == PlayerCharacterState.MOVING_RIGHT) {
      image = pcRunningImage;
      this.runningStateCurrentFrame += 0.25;

      if (this.runningStateCurrentFrame >= this.runningStateTotalFrame) {
        this.runningStateCurrentFrame = 0;
      }

      currentFrame = this.runningStateCurrentFrame;
      totalFrame = this.runningStateTotalFrame;

      if (this.state == PlayerCharacterState.MOVING_LEFT) {
        image = mirrorImageVertical(image);
      }
    } else if (this.state == PlayerCharacterState.SHOOTING) {
      image = pcShootingImage;
      this.shootingStateCurrentFrame += 0.2;

      if (this.shootingStateCurrentFrame >= this.shootingStateTotalFrame) {
        this.shootingStateCurrentFrame = 0;
        this.state = PlayerCharacterState.IDLE;
      }

      currentFrame = this.shootingStateCurrentFrame;
      totalFrame = this.shootingStateTotalFrame;
    }

    let frame = Math.floor(0);
    let pieceWidth = image.width / totalFrame;
    let pieceHeight = image.height;

    const destinationScale = 4.5;
    ctx.drawImage(
      image,
      frame * pieceWidth,
      0,
      pieceWidth,
      pieceHeight,
      x - pieceWidth / 2,
      y - pieceHeight / 2,
      pieceWidth * destinationScale,
      pieceHeight * destinationScale
    );

    if (this.game.lifeKeeper.remainingLives < MAX_PLAYER_LIVES){
      let [x, y] = this.computeCurrentCoordinates();
      const fireSize = 3 + 1.2 * (MAX_PLAYER_LIVES - this.game.lifeKeeper.remainingLives)
      drawFireEffect(ctx, x + this.hitboxWidth / 2, y + this.hitboxHeight / 2, fireSize, 100, this.fireArray);
    }

    if (this.game.inDebugMode) {
      ctx.strokeStyle = "rgba(0, 0, 0, 1)";
      let [x, y] = this.computeCurrentCoordinates();
      ctx.strokeRect(x, y, this.hitboxWidth, this.hitboxHeight);
    }
  }
  x(x: any, y: any, hitboxWidth: any, hitboxHeight: any) {
    throw new Error("Method not implemented.");
  }
  y(x: any, y: any, hitboxWidth: any, hitboxHeight: any) {
    throw new Error("Method not implemented.");
  }
}
