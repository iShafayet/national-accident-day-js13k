import { InputState } from "../InputState";
import { GamepadInputState } from "./GamepadInputState";
import { KeyboardInputState } from "./KeyboardInputState";

let debounceMap = {};
function debounceKey(key: string, value: boolean, debounceDuration: number): boolean {
  if (!(key in debounceMap)) {
    debounceMap[key] = 0;
  }

  if (!value) return value;

  if (Date.now() - debounceMap[key] > debounceDuration) {
    debounceMap[key] = Date.now();
    return true;
  } else {
    return false;
  }
}

export function combineInputStates(inputState: InputState, keyboardInputState: KeyboardInputState, gamepadInputState: GamepadInputState, touchInputState: KeyboardInputState) {
  inputState.up = keyboardInputState.up || gamepadInputState.gamepadUp || touchInputState.up;
  inputState.down = keyboardInputState.down || gamepadInputState.gamepadDown || touchInputState.down;
  inputState.left = keyboardInputState.left || gamepadInputState.gamepadLeft || touchInputState.left;
  inputState.right = keyboardInputState.right || gamepadInputState.gamepadRight || touchInputState.right;
  inputState.space = keyboardInputState.space || gamepadInputState.gamepadA || touchInputState.space;
  inputState.f = keyboardInputState.f || gamepadInputState.gamepadB || touchInputState.f;

  inputState.space = debounceKey("SPACE", inputState.space, 300);
  inputState.f = debounceKey("F", inputState.f, 300);
}
