import { CANVAS_BASE_WIDTH } from "../constants";
import { Game } from "./Game";

export class ScoreKeeper {
  game: Game;
  currentScore: number;
  highScore: number;

  textFillStyle = "#FFFFFF"; // White color for better visibility on gray

  constructor(game: Game) {
    this.game = game;
    this.currentScore = 0;
    this.highScore = 0;
  }

  initialize() {
    this.highScore = this.fetchHighScore();
  }

  awardScore(delta: number) {
    this.currentScore += delta;

    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
      this.sethHighScore();
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    {
      let text = "HIGHSCORE " + `${this.highScore}`.padStart(8, "00000000");
      ctx.font = "normal 14px Courier New";
      ctx.fillStyle = this.textFillStyle;
      ctx.fillText(text, 60, 56);
    }
    {
      let text = "SCORE " + this.getFormattedCurrentScore();
      ctx.font = "bold 20px Courier New";
      ctx.fillStyle = this.textFillStyle;
      ctx.fillText(text, 60, 36);
    }
  }

  getFormattedCurrentScore() {
    return `${this.currentScore}`.padStart(8, "00000000");
  }

  private fetchHighScore() {
    return parseInt(localStorage.getItem("--nat-acc-day--high-score")) || 0;
  }

  private sethHighScore() {
    localStorage.setItem("--nat-acc-day--high-score", `${this.highScore}`);
  }
}
