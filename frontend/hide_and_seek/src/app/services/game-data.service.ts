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

  private _mapMode = new BehaviorSubject<'1D' | '2D'>('1D');
  mapMode$ = this._mapMode.asObservable();

  selectSpot(spot: HidingSpot | null): void {
    this._selectedSpot.next(spot);
  }

  setGameSettings(gameSettings: GameSettings | null): void {
    this._gameSettings.next(gameSettings);
  }

  resetGameSettings(): void {
    this._gameSettings.next(null);
  }

  getGameSettings(): GameSettings | null {
    return this._gameSettings.getValue();
  }

  setMapMode(mode: '1D' | '2D'): void {
    this._mapMode.next(mode);
  }

  setSpots(easy: number[], medium: number[], hard: number[]): void {
    this._gameSettings.getValue()!.easySpots = easy;
    this._gameSettings.getValue()!.mediumSpots = medium;
    this._gameSettings.getValue()!.hardSpots = hard;
  }

}
