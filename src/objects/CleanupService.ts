import { Enemy } from "./Enemy";
import { Game } from "./Game";

export class CleanupService {
  game: Game;

  enemyToCleanupList: Enemy[];


  constructor(game: Game) {
    this.game = game;
    this.enemyToCleanupList = [];
  }

  updateState() {
    {
      let localIndex = this.enemyToCleanupList.length;
      while (localIndex--) {
        let enemy = this.enemyToCleanupList[localIndex];

        let index = this.game.enemyList.indexOf(enemy);
        if (index > -1) {
          this.game.enemyList.splice(index, 1);
        }

        this.enemyToCleanupList.splice(localIndex, 1);
      }
    }
  }

  registerEnemyForCleanup(enemy: Enemy) {
    this.enemyToCleanupList.push(enemy);
  }
}
