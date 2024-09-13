import { InputState } from "./InputState";
import { CANVAS_BASE_HEIGHT, CANVAS_BASE_WIDTH } from "./constants";
import { GamepadInputState } from "./input/GamepadInputState";
import { KeyboardInputState } from "./input/KeyboardInputState";
import { combineInputStates } from "./input/combineInput";
import { collectGamepadButtonPresses } from "./input/gamepad";
import { setupKeyboardEventDetection } from "./input/keyboard";
import { setupTouchEventDetection } from "./input/touchInput";

import { Game } from "./objects/Game";

const canvas: HTMLCanvasElement = document.createElement("canvas");
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

canvas.id = "gameCanvas";
canvas.width = CANVAS_BASE_WIDTH;
canvas.height = CANVAS_BASE_HEIGHT;
canvas.style.maxWidth = "100vw";
canvas.style.maxHeight = "100vh";
const div = document.createElement("div");
div.appendChild(canvas);
document.body.appendChild(canvas);

const inputState: InputState = {
  left: false,
  right: false,
  up: false,
  down: false,
  space: false,
  f: false,
};

const keyboardInputState: KeyboardInputState = {
  left: false,
  right: false,
  up: false,
  down: false,
  space: false,
  f: false,
};


const touchInputState: KeyboardInputState = {
  left: false,
  right: false,
  up: false,
  down: false,
  space: false,
  f: false,
};


const gamepadInputState: GamepadInputState = {
  gamepadUp: false,
  gamepadDown: false,
  gamepadLeft: false,
  gamepadRight: false,
  gamepadA: false,
  gamepadB: false,
};

setupKeyboardEventDetection(keyboardInputState);

setupTouchEventDetection(touchInputState);

let game: Game;

function createNewGame() {
  game = new Game();
  game.initialize();
  game.showMenu();

  game.subscribeToGameReset(() => {
    createNewGame();
  });
}

createNewGame();

function tick(t: number) {
  collectGamepadButtonPresses(gamepadInputState);

  combineInputStates(inputState, keyboardInputState, gamepadInputState, touchInputState);

  game.updateState(inputState);
  game.draw(ctx);
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);


