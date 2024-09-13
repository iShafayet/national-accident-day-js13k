import { CANVAS_BASE_HEIGHT, CANVAS_BASE_WIDTH } from "../constants";
import { Game } from "./Game";
import { GameState } from "./GameState";

export class MenuWithCredits {
  game: Game;
  constructor(game: Game) {
    this.game = game;
  }

  textFillStyle = "#FFFFFF";

  draw(ctx: CanvasRenderingContext2D) {
    let yCursor = 300;
    if (this.game.state !== GameState.MENU) {
      return;
    }
    {
      ctx.fillStyle = "rgba(45, 66, 53, 0.9)";
      ctx.fillRect(60, 240, CANVAS_BASE_WIDTH - 120, 600);
    }
    {
      let text = "13th September 2024. Helsinki, Finland.";
      ctx.font = "normal 16px Courier New";
      ctx.fillStyle = this.textFillStyle;
      ctx.fillText(text, 80, yCursor);
      yCursor += 60;
    }
    {
      let text = "You were supposed to give a speech at the National Accident";
      ctx.font = "normal 16px Courier New";
      ctx.fillStyle = this.textFillStyle;
      ctx.fillText(text, 80, yCursor);
      yCursor += 30;
    }
    {
      let text = "Day Awareness event, but you are very very late. You need";
      ctx.font = "normal 16px Courier New";
      ctx.fillStyle = this.textFillStyle;
      ctx.fillText(text, 80, yCursor);
      yCursor += 30;
    }
    {
      let text = "to make it there on time, but the traffic is horrible.";
      ctx.font = "normal 16px Courier New";
      ctx.fillStyle = this.textFillStyle;
      ctx.fillText(text, 80, yCursor);
      yCursor += 60;
    }
    {
      let text = "Navigate through the traffic and avoid accidents to make";
      ctx.font = "normal 16px Courier New";
      ctx.fillStyle = this.textFillStyle;
      ctx.fillText(text, 80, yCursor);
      yCursor += 30;
    }
    {
      let text = "it to the venue on time.";
      ctx.font = "normal 16px Courier New";
      ctx.fillStyle = this.textFillStyle;
      ctx.fillText(text, 80, yCursor);
      yCursor += 80;
    }
    {
      let text = "National Accident Day";
      ctx.font = "normal 32px Courier New";
      ctx.fillStyle = this.textFillStyle;
      ctx.fillText(text, 80, yCursor);
        yCursor += 50;
    }

    {
      let text = "Press [SPACE] / [🎮 A] to get started";
      ctx.font = "normal 20px Courier New";
      ctx.fillStyle = this.textFillStyle;
      ctx.fillText(text, 80, yCursor);

      yCursor += 100;
    }

    {
      let text = "Credits";
      ctx.font = "normal 20px Courier New";
      ctx.fillStyle = this.textFillStyle;
      ctx.fillText(text, 80, yCursor);
      yCursor += 30;
    }

    {
      let text = "Developer: Sayem Shafayet";
      ctx.font = "normal 20px Courier New";
      ctx.fillStyle = this.textFillStyle;
      ctx.fillText(text, 80, yCursor);
      yCursor += 30;
    }
    {
      let text = "Music: Mysha Azfar";
      ctx.font = "normal 20px Courier New";
      ctx.fillStyle = this.textFillStyle;
      ctx.fillText(text, 80, yCursor);
      yCursor += 30;
    }
  }
}
