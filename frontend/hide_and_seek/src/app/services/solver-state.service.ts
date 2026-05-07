import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameResult } from '../models/gameResult';
import { SimulationResults } from '../models/simulationResults';

@Injectable({ providedIn: 'root' })
export class SolverStateService {
  private resultSubject = new BehaviorSubject<GameResult | SimulationResults | null>(null);

  result$ = this.resultSubject.asObservable();

  globalHumanScore: number = 0;
  globalComputerScore: number = 0;
  globalHumanWins: number = 0;
  globalComputerWins: number = 0;

  setResult(result: GameResult | SimulationResults): void {
    this.resultSubject.next(result);
  }

  getResult(): GameResult | SimulationResults | null {
    return this.resultSubject.getValue();
  }

  clear(): void {
    this.resultSubject.next(null);
  }

  resetGlobalScores(): void {
    this.globalHumanScore = 0;
    this.globalComputerScore = 0;
    this.globalHumanWins = 0;
    this.globalComputerWins = 0;
  }

  addRoundScore(payoff: number, humanRole: string): void {
    if (humanRole === 'HIDER') {
      this.globalHumanScore += payoff;
      this.globalComputerScore -= payoff;
      if (payoff > 0) this.globalHumanWins++;
      else if (payoff < 0) this.globalComputerWins++;
    } else {
      this.globalComputerScore += payoff;
      this.globalHumanScore -= payoff;
      if (payoff > 0) this.globalComputerWins++;
      else if (payoff < 0) this.globalHumanWins++;
    }
  }
}
