export function doRectanglesCollide(
  r1x: number,
  r1y: number,
  r1width: number,
  r1height: number,
  r2x: number,
  r2y: number,
  r2width: number,
  r2height: number
): boolean {
  // Check if one rectangle is to the left of the other
  if (r1x + r1width < r2x || r2x + r2width < r1x) {
    return false;
  }

  // Check if one rectangle is above the other
  if (r1y + r1height < r2y || r2y + r2height < r1y) {
    return false;
  }

  // If we've made it here, the rectangles are colliding
  return true;
}

