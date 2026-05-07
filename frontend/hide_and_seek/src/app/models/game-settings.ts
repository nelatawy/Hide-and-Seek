export class GameSettings {
  easy: number;
  medium: number;
  hard: number;

  easySpots: number[];
  mediumSpots: number[];
  hardSpots: number[];

  role: 'HIDER' | 'SEEKER';
  pickedSpot: number;

  dimensions: number;
  proximity: boolean;

  constructor(easy: number, medium: number, hard: number, is_hider: boolean, dimensions: number = 1, proximity: boolean = false) {
    this.easy = easy;
    this.medium = medium;
    this.hard = hard;
    this.role = is_hider ? 'HIDER' : 'SEEKER';
    this.pickedSpot = -1;
    this.easySpots = [];
    this.mediumSpots = [];
    this.hardSpots = [];
    this.dimensions = dimensions;
    this.proximity = proximity;
  }
}
