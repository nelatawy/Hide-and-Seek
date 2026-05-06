export class GameSettings {
    easy: number;
    medium: number;
    hard: number;

    easy_spots: number[];
    medium_spots: number[];
    hard_spots: number[];

    is_hider: boolean;
    picked_spot: number;

    constructor(easy: number, medium: number, hard: number, is_hider: boolean) {
        this.easy = easy;
        this.medium = medium;
        this.hard = hard;
        this.is_hider = is_hider;
        this.picked_spot = -1;
        this.easy_spots = [];
        this.medium_spots = [];
        this.hard_spots = [];
    }
}