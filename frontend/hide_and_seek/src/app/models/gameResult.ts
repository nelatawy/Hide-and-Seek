export class GameResult {
  payoffMatrix: number[][];
  gameValue: number;
  computerProb: number[];
  pickedSpot: number;
  roundPayoff: number;

  constructor() {
    this.payoffMatrix = [];
    this.gameValue = 0;
    this.computerProb = [];
    this.pickedSpot = -1;
    this.roundPayoff = 0;
  }
}
