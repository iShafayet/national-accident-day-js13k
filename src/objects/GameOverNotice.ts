import { InputState } from "../InputState";
import { CANVAS_BASE_HEIGHT, CANVAS_BASE_WIDTH, GAME_RESET_OPTION_TIMEOUT } from "../constants";
import { Game } from "./Game";
import { GameState } from "./GameState";

export class GameOverNotice {
  game: Game;
  constructor(game: Game) {
    this.game = game;
  }

  textFillStyle = "#FFFFFF";

  gameEndedTimeStamp: number = 0;

  notifyGameOver() {
    this.gameEndedTimeStamp = Date.now();

    playAudioFx(2);
  }

  private isGameResettable() {
    return this.game.state === GameState.ENDED && Date.now() - this.gameEndedTimeStamp > GAME_RESET_OPTION_TIMEOUT;
  }

  shouldResetGame(inputState: InputState) {
    return this.isGameResettable() && inputState.space;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.game.state !== GameState.ENDED) {
      return;
    }
    {
      ctx.fillStyle = "rgba(45, 66, 53, 0.9)";
      ctx.fillRect(60, 200+140, CANVAS_BASE_WIDTH - 120, 360);
    }
    {
      let text = "Better luck next time!";
      ctx.font = "normal 32px Courier New";
      ctx.fillStyle = this.textFillStyle;
      ctx.fillText(text, 120, 200+240);
    }

    if (this.game.scoreKeeper.currentScore >= this.game.scoreKeeper.highScore) {
      let text = "You got the high score though!";
      ctx.font = "normal 16px Courier New";
      ctx.fillStyle = this.textFillStyle;
      ctx.fillText(text, 120, 200+280);
    }

    {
      let score = this.game.scoreKeeper.getFormattedCurrentScore();
      let text = `Your Score: ${score}`;
      ctx.font = "normal 24px Courier New";
      ctx.fillStyle = this.textFillStyle;
      ctx.fillText(text, 120, 200+320);
    }
    if (this.isGameResettable()) {
      let text = "Press [SPACE] / [🎮 A] to continue";
      ctx.font = "normal 20px Courier New";
      ctx.fillStyle = this.textFillStyle;
      ctx.fillText(text, 120, 200+420);
    }
  }
}
