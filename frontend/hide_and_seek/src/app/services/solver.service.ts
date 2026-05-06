import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SolverResult } from '../models/solver-result.model';
import { GameSettings } from '../models/game-settings';

@Injectable({ providedIn: 'root' })
export class SolverService {
  private readonly apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  solve(gameSettings: GameSettings, selected_spot: number): Observable<SolverResult> {
    gameSettings.picked_spot = selected_spot;
    return this.http.post<SolverResult>(`${this.apiUrl}/solve`, gameSettings);
  }


}
