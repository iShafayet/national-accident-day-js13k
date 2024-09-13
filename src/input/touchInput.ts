import { KeyboardInputState } from "./KeyboardInputState";

export function setupTouchEventDetection(inputState: KeyboardInputState) {
  var container = document;

  container.addEventListener("touchstart", startTouch, false);
  container.addEventListener("touchend", endTouch, false);
  container.addEventListener("touchcancel", endTouch, false);
  container.addEventListener("touchmove", moveTouch, false);

  // Swipe Up / Down / Left / Right
  var initialX = null;
  var initialY = null;

  let lastTouch = 0;

  function startTouch(e) {
    if (Date.now() - lastTouch < 300) {
      inputState.space = true;
    }
    lastTouch = Date.now();

    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
  };

  function endTouch(e) {
    initialX = null;
    initialY = null;
    inputState.left = false;
    inputState.right = false;
    inputState.up = false;
    inputState.down = false;
    inputState.space = false;
  }

  function moveTouch(e) {
    if (initialX === null) {
      return;
    }

    if (initialY === null) {
      return;
    }

    var currentX = e.touches[0].clientX;
    var currentY = e.touches[0].clientY;

    var diffX = initialX - currentX;
    var diffY = initialY - currentY;

    // sliding horizontally
    if (diffX > 0) {
      // swiped left
      inputState.left = true;
      console.debug("swiped left");
    } else if (diffX < 0) {
      // swiped right
      inputState.right = true;
      console.debug("swiped right");
    }

    // sliding vertically
    if (diffY > 0) {
      // swiped up
      inputState.up = true;
      console.debug("swiped up");
    } else if (diffY < 0) {
      // swiped down
      inputState.down = true;
      console.debug("swiped down");
    }


    e.preventDefault();
  };
}

