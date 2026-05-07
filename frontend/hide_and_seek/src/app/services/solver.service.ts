import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GameResult } from '../models/gameResult';
import { SimulationResults } from '../models/simulationResults';
import { SimulationSettings } from '../models/simulationSettings';
import { GameSettings } from '../models/game-settings';

@Injectable({ providedIn: 'root' })
export class SolverService {
  private readonly apiUrl = 'http://localhost:8080/api/game';

  constructor(private http: HttpClient) { }

  play(gameSettings: GameSettings, selected_spot: number): Observable<GameResult> {
    gameSettings.pickedSpot = selected_spot;
    return this.http.post<GameResult>(`${this.apiUrl}/play`, gameSettings);
  }

  simulate(settings: SimulationSettings): Observable<SimulationResults> {
    return this.http.post<SimulationResults>(`${this.apiUrl}/simulate`, settings);
  }


}
