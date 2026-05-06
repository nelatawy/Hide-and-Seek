import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HidingSpot } from '../models/hiding_spot';
import { GameSettings } from '../models/game-settings';

@Injectable({ providedIn: 'root' })
export class GameDataService {

    private _selectedSpot = new BehaviorSubject<HidingSpot | null>(null);
    selectedSpot$ = this._selectedSpot.asObservable();

    private _gameSettings = new BehaviorSubject<GameSettings | null>(null);
    gameSettings$ = this._gameSettings.asObservable();

    selectSpot(spot: HidingSpot | null): void {
        this._selectedSpot.next(spot);
    }

    setGameSettings(gameSettings: GameSettings): void {
        this._gameSettings.next(gameSettings);
    }

    getGameSettings(): GameSettings | null {
        return this._gameSettings.getValue();
    }

    setSpots(easy: number[], medium: number[], hard: number[]): void {
        this._gameSettings.getValue()!.easy_spots = easy;
        this._gameSettings.getValue()!.medium_spots = medium;
        this._gameSettings.getValue()!.hard_spots = hard;
    }


}