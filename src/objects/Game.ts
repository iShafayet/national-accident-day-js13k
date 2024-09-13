import { InputState } from "../InputState";
import { CANVAS_BASE_HEIGHT, CANVAS_BASE_WIDTH } from "../constants";
import { CleanupService } from "./CleanupService";
import { Enemy } from "./Enemy";
import { EnemyFactory } from "./EnemyFactory";
import { EnemyType } from "./EnemyType";
import { FpsCounter } from "./FpsCounter";
import { GameOverNotice } from "./GameOverNotice";
import { GameState } from "./GameState";
import { Level } from "./Level";
import { LifeKeeper } from "./LifeKeeper";
import { MenuWithCredits } from "./MenuWithCredits";
import { PlayerCharacter } from "./PlayerCharacter";
import { Road } from "./Road";
import { ScoreKeeper } from "./ScoreKeeper";

export class Game {
  state = GameState.IDLE;

  inDebugMode: boolean = false;

  pc: PlayerCharacter;
  fpsCounter: FpsCounter;
  road: Road;
  enemyFactory: EnemyFactory;
  enemyList: Enemy[];
  scoreKeeper: ScoreKeeper;
  lifeKeeper: LifeKeeper;
  cleanupService: CleanupService;
  menuWithCredits: MenuWithCredits;
  gameOverNotice: GameOverNotice;
  level: Level;

  time: number;
  gameResetSubscriberFn: Function;

  baseSpeed: number = 10;

  public initialize() {
    this.updateTime();

    this.fpsCounter = new FpsCounter(this);
    this.enemyFactory = new EnemyFactory(this);
    this.road = new Road(this);
    this.pc = new PlayerCharacter(this);
    this.scoreKeeper = new ScoreKeeper(this);
    this.cleanupService = new CleanupService(this);
    this.lifeKeeper = new LifeKeeper(this);
    this.menuWithCredits = new MenuWithCredits(this);
    this.gameOverNotice = new GameOverNotice(this);
    this.level = new Level(this);

    this.enemyList = [];

    this.scoreKeeper.initialize();
    this.pc.initialize();
  }

  public showMenu() {
    this.state = GameState.MENU;
    this.enemyFactory.notifyMenuShown();
  }

  public startGame() {
    this.state = GameState.STARTED;
    this.enemyFactory.notifyGameStart();
    this.fpsCounter.notifyGameStart();
  }

  public updateState(inputState: InputState) {
    if (this.state === GameState.MENU && inputState.space) {
      this.startGame();
      inputState.space = false;
    }

    if (this.gameOverNotice.shouldResetGame(inputState)) {
      this.gameResetSubscriberFn();
      return;
    }

    this.level.updateState();

    this.road.updateState();

    this.pc.updateState(inputState);

    this.enemyFactory.updateState();

    this.enemyList.forEach((enemy: Enemy) => {
      enemy.updateState();
    });

    this.cleanupService.updateState();
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, CANVAS_BASE_WIDTH, CANVAS_BASE_HEIGHT);

    this.road.draw(ctx);

    this.enemyList.forEach((enemy: Enemy) => {
      enemy.draw(ctx);
    });

    this.menuWithCredits.draw(ctx);

    this.gameOverNotice.draw(ctx);

    this.level.draw(ctx);

    this.pc.draw(ctx);

    this.scoreKeeper.draw(ctx);
    this.lifeKeeper.draw(ctx);

    this.fpsCounter.draw(ctx);
  }

  private updateTime() {
    this.time = Date.now();
  }

  public triggerGameOver() {
    this.state = GameState.ENDED;
    this.gameOverNotice.notifyGameOver();
  }

  public subscribeToGameReset(subscriberFn: Function) {
    this.gameResetSubscriberFn = subscriberFn;
  }
}
